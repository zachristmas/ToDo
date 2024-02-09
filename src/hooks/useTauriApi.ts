import { useEffect, useState } from 'react'

import { invoke } from '@tauri-apps/api/tauri'

function useTauriApi<T = any>(command: string, params: any): [T | null, boolean, any] {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<any>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const result = await invoke<T>(command, params);
        setData(result);
      } catch (err) {
        setError(err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [command, params]);

  return [data, loading, error];
}

export default useTauriApi;