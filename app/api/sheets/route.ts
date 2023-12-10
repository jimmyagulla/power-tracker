export async function GET(req: any) {
  const sheetId = req.nextUrl.searchParams.get('sheetId');
  const base = `https://docs.google.com/spreadsheets/d/${sheetId}/gviz/tq?`;
  const sheetName = 'JIMMY AGULLA';
  const query = encodeURIComponent('Select *');
  const url = `${base}&sheet=${sheetName}&tq=${query}`;
  
  const data = await fetch(url).then(res => res.text());

  return new Response(JSON.stringify(data), { status: 200 });
}