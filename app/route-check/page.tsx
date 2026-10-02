export default function RouteCheckPage() {
  return (
    <main style={{minHeight:'100vh',background:'#020812',color:'white',padding:'40px',fontFamily:'Arial, sans-serif'}}>
      <div style={{maxWidth:'760px',margin:'0 auto',border:'1px solid #1e3a5f',borderRadius:'24px',padding:'28px',background:'#07111f'}}>
        <div style={{fontSize:'13px',letterSpacing:'0.18em',color:'#38bdf8',fontWeight:700}}>JERSEYOS</div>
        <h1 style={{fontSize:'34px',margin:'10px 0'}}>Routing is active</h1>
        <p style={{color:'#a9b7ca',lineHeight:1.7}}>If you can see this page, the deployed Worker is serving application routes correctly.</p>
        <div style={{display:'flex',gap:'12px',flexWrap:'wrap',marginTop:'24px'}}>
          <a href="/" style={{padding:'12px 18px',borderRadius:'14px',background:'#172033',color:'white',textDecoration:'none'}}>Dashboard</a>
          <a href="/image-to-vector" style={{padding:'12px 18px',borderRadius:'14px',background:'#0875ff',color:'white',textDecoration:'none'}}>Open VectorForge</a>
          <a href="/new-project" style={{padding:'12px 18px',borderRadius:'14px',background:'#0b8bff',color:'white',textDecoration:'none'}}>New Project</a>
        </div>
      </div>
    </main>
  );
}
