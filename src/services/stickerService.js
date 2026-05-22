import { supabase, isSupabaseConfigured } from '../lib/supabaseClient';
import { fallbackAlbumPages, fallbackStickers } from '../data/albumMetadata';

const singleUserKey = 'ammycita-single-user';

function normalizeSticker(sticker, ownedRows = []) {
  const ownedMatch = ownedRows.find((row) => row.sticker_id === sticker.id);

  return {
    ...sticker,
    owned: Boolean(ownedMatch?.owned),
    obtained_at: ownedMatch?.obtained_at ?? null,
  };
}

export async function getAlbumPages() {
  if (!isSupabaseConfigured) {
    return fallbackAlbumPages;
  }

  const { data, error } = await supabase
    .from('album_pages')
    .select('*')
    .order('page_number', { ascending: true });

  if (error) throw error;
  return data?.length ? data : fallbackAlbumPages;
}

export async function getStickers() {
  if (!isSupabaseConfigured) {
    const ownedIds = JSON.parse(localStorage.getItem('ammycita-owned-stickers') || '[]');
    return fallbackStickers.map((sticker) => ({ ...sticker, owned: ownedIds.includes(sticker.id) }));
  }

  const [{ data: stickers, error: stickerError }, { data: ownedRows, error: ownedError }] =
    await Promise.all([
      supabase.from('stickers').select('*').order('code', { ascending: true }),
      supabase.from('user_stickers').select('*').eq('profile_key', singleUserKey),
    ]);

  if (stickerError) throw stickerError;
  if (ownedError) throw ownedError;

  return (stickers || []).map((sticker) => normalizeSticker(sticker, ownedRows || []));
}

export async function setStickerOwned(stickerId, owned) {
  if (!isSupabaseConfigured) {
    const ownedIds = new Set(JSON.parse(localStorage.getItem('ammycita-owned-stickers') || '[]'));

    if (owned) {
      ownedIds.add(stickerId);
    } else {
      ownedIds.delete(stickerId);
    }

    localStorage.setItem('ammycita-owned-stickers', JSON.stringify([...ownedIds]));
    return;
  }

  const { error } = await supabase.from('user_stickers').upsert(
    {
      sticker_id: stickerId,
      profile_key: singleUserKey,
      owned,
      obtained_at: owned ? new Date().toISOString() : null,
      updated_at: new Date().toISOString(),
    },
    { onConflict: 'profile_key,sticker_id' },
  );

  if (error) throw error;
}

export function getGeneralProgress(stickers) {
  const total = stickers.length;
  const owned = stickers.filter((sticker) => sticker.owned).length;
  const missing = Math.max(total - owned, 0);
  const percent = total ? Math.round((owned / total) * 100) : 0;

  return { total, owned, missing, percent };
}

export function getProgressBySection(stickers) {
  const grouped = stickers.reduce((acc, sticker) => {
    const key = sticker.country || sticker.section || 'Sin seccion';

    if (!acc[key]) {
      acc[key] = { section: key, total: 0, owned: 0, verified: 0 };
    }

    acc[key].total += 1;
    acc[key].owned += sticker.owned ? 1 : 0;
    acc[key].verified += sticker.verified ? 1 : 0;
    return acc;
  }, {});

  return Object.values(grouped)
    .map((item) => ({
      ...item,
      percent: item.total ? Math.round((item.owned / item.total) * 100) : 0,
    }))
    .sort((a, b) => a.section.localeCompare(b.section));
}
