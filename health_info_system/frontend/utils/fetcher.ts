// frontend/utils/fetcher.ts

export const fetcher = (url: string) => fetch(url).then(res => {
  if (!res.ok) {
    return res.json().then(err => { throw new Error(err.message || 'Error fetching data') });
  }
  return res.json();
});
