
const AGR = {
  config: null,
  user: JSON.parse(localStorage.getItem('agr_user') || 'null'),
  async loadConfig(){
    try{
      const res = await fetch('data/config.json');
      this.config = await res.json();
    }catch(e){
      this.config = { plataforma_url:'', formularios_kobo:{} };
    }
    this.renderConfig();
  },
  renderConfig(){
    document.querySelectorAll('[data-course]').forEach(e=>e.textContent=this.config.proyecto||'Academia Digital');
    document.querySelectorAll('[data-cohort]').forEach(e=>e.textContent=this.config.cohorte_default||'COH-2026-001');
    document.querySelectorAll('[data-aval]').forEach(e=>e.textContent=this.config.aval||'Sambies');
    document.querySelectorAll('[data-kobo]').forEach(a=>{
      const k=a.getAttribute('data-kobo');
      if(this.config.formularios_kobo && this.config.formularios_kobo[k]) a.href=this.config.formularios_kobo[k];
    });
  },
  login(){
    const correo = document.getElementById('correo')?.value?.trim().toLowerCase();
    const codigo = document.getElementById('codigo')?.value?.trim();
    const rol = document.getElementById('rol')?.value || 'Estudiante';
    if(!correo || !codigo){ alert('Ingrese correo y código de acceso.'); return; }
    const user = {correo,codigo,rol,nombre:correo.split('@')[0], fecha:new Date().toISOString()};
    localStorage.setItem('agr_user', JSON.stringify(user));
    location.href = rol === 'Profesor' ? 'profesor.html' : 'estudiante.html';
  },
  logout(){ localStorage.removeItem('agr_user'); location.href='index.html'; },
  requireRole(roles){
    const u = JSON.parse(localStorage.getItem('agr_user') || 'null');
    if(!u){ location.href='login.html'; return; }
    if(roles && !roles.includes(u.rol)){ location.href='login.html'; return; }
    document.querySelectorAll('[data-user]').forEach(e=>e.textContent=u.correo);
    document.querySelectorAll('[data-role]').forEach(e=>e.textContent=u.rol);
    document.querySelectorAll('[data-code]').forEach(e=>e.textContent=u.codigo);
  },
  copyPrompt(id){
    const el=document.getElementById(id);
    if(el){ navigator.clipboard.writeText(el.textContent); alert('Texto copiado.'); }
  }
};
document.addEventListener('DOMContentLoaded',()=>AGR.loadConfig());
