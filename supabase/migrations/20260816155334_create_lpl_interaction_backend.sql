create schema if not exists private_lpl;

create table if not exists private_lpl.responses (
  id bigint generated always as identity primary key,
  event_code text not null default 'CARE2026',
  participant_id uuid not null,
  role text not null check (role in ('patient','partner','nurse')),
  behaviors text[] not null default '{}',
  emotions text[] not null default '{}',
  stance text check (stance is null or stance in ('super','distract','blame','please','congruent')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (event_code, participant_id)
);

create index if not exists responses_event_role_idx on private_lpl.responses (event_code, role);
revoke all on schema private_lpl from public, anon, authenticated;
revoke all on all tables in schema private_lpl from public, anon, authenticated;

create or replace function public.submit_lpl_response(
  p_participant_id uuid,
  p_role text,
  p_behaviors text[] default '{}',
  p_emotions text[] default '{}',
  p_stance text default null,
  p_event_code text default 'CARE2026'
) returns void
language plpgsql
security definer
set search_path = ''
as $$
begin
  if p_role not in ('patient','partner','nurse') then raise exception 'invalid role'; end if;
  if cardinality(p_behaviors) > 3 or cardinality(p_emotions) > 10 then raise exception 'too many selections'; end if;
  if p_stance is not null and p_stance not in ('super','distract','blame','please','congruent') then raise exception 'invalid stance'; end if;

  insert into private_lpl.responses (event_code, participant_id, role, behaviors, emotions, stance)
  values (upper(p_event_code), p_participant_id, p_role, p_behaviors, p_emotions, p_stance)
  on conflict (event_code, participant_id) do update
  set role = excluded.role,
      behaviors = excluded.behaviors,
      emotions = excluded.emotions,
      stance = excluded.stance,
      updated_at = now();
end;
$$;

create or replace function public.get_lpl_stats(p_event_code text default 'CARE2026') returns jsonb
language sql
stable
security definer
set search_path = ''
as $$
  select jsonb_build_object(
    'participants', count(*),
    'responses', coalesce(
      jsonb_agg(jsonb_build_object('role', role, 'behaviors', behaviors, 'emotions', emotions, 'stance', stance) order by updated_at)
      filter (where id is not null),
      '[]'::jsonb
    )
  )
  from private_lpl.responses
  where event_code = upper(p_event_code);
$$;

revoke all on function public.submit_lpl_response(uuid,text,text[],text[],text,text) from public;
revoke all on function public.get_lpl_stats(text) from public;
grant execute on function public.submit_lpl_response(uuid,text,text[],text[],text,text) to anon, authenticated;
grant execute on function public.get_lpl_stats(text) to anon, authenticated;
