revoke update on public.profiles from authenticated, anon;
grant update (display_name, birth_date, locale, ai_training_opt_in, terms_accepted_at) on public.profiles to authenticated;
revoke insert, delete on public.profiles from authenticated, anon;
revoke all on public.dreams, public.interpretations from anon;
revoke execute on function public.handle_new_user() from public, anon, authenticated;
revoke execute on function public.set_updated_at() from public, anon, authenticated;
