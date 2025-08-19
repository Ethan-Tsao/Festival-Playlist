import { useSession } from "next-auth/react";
import { useEffect, useState } from 'react';
import { supabaseBrowser } from '@/lib/supabase-browser';

type Comment = {
  id: string;
  poster_id: string;
  author: string | null;
  content: string;
  created_at: string;
};

export default function Comments({posterId}: {posterId: string}) {
    const { data: session } = useSession();
    return(
        <>
        </>
    )
}