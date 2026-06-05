// 'use client'
// import { useEffect, useRef, useState } from 'react'
// import { fetchWithAuth } from '@/lib/fetchWithAuth'

// const BACKEND = process.env.NEXT_PUBLIC_BACKEND_URL ?? 'http://localhost:5000'

// type HotspotLink = { targetPanoramaId: string | null, transition?: string | null }
// type Hotspot = {
//   id: string
//   type: 'INFORMACION' | 'LINK'
//   x: number
//   y: number
//   z: number
//   icon: 'INFO' | 'FLECHA'
//   titulo?: string | null
//   contenido?: string | null
//   orden?: number | null
//   activo: boolean
//   link?: HotspotLink | null
// }
// type PanoramaDTO = {
//   id: string
//   name: string
//   fileUrl: string
//   oficina_id: number
//   oficina: { ID_oficina: number; nombre: string; horario_atencion: string }
//   encargado_actual?: any
//   hotspots: Hotspot[]
// }

// type MiniPano = { id: string; name: string }

// export default function HotspotEditor({ panoId, onClose }: { panoId: string; onClose: () => void }) {
//   const containerRef = useRef<HTMLDivElement | null>(null)
//   const viewerRef = useRef<any>(null)
//   const viewRef = useRef<any>(null)
//   const sceneRef = useRef<any>(null)

//   const [pano, setPano] = useState<PanoramaDTO | null>(null)
//   const [allPanos, setAllPanos] = useState<MiniPano[]>([]) // para seleccionar destino en LINK
//   const [tempYawPitch, setTempYawPitch] = useState<{ yaw: number; pitch: number } | null>(null)
//   const [form, setForm] = useState<null | {
//     type: 'INFORMACION' | 'LINK'
//     icon: 'INFO' | 'FLECHA'
//     titulo?: string
//     targetPanoramaId?: string
//   }>(null)

//   // carga panorama + viewer
//   useEffect(() => {
//     let mounted = true
//     ;(async () => {
//       const r = await fetchWithAuth(`${BACKEND}/panoramas/${panoId}`)
//       if (!r.ok) throw new Error('No se pudo cargar panorama')
//       const data: PanoramaDTO = await r.json()
//       if (!mounted) return
//       setPano(data)

//       // opcional: lista de todos los panos para destino LINK
//       const r2 = await fetchWithAuth(`${BACKEND}/oficinas/${data.oficina_id}/panoramas`)
//       const items: MiniPano[] = r2.ok ? await r2.json() : []
//       setAllPanos(items.map(i => ({ id: i.id, name: i.name })))

//       const Marzipano = (await import('marzipano')).default
//       if (!containerRef.current) return

//       const viewer = new Marzipano.Viewer(containerRef.current, { stage: { progressive: true } })
//       viewerRef.current = viewer

//       const source = Marzipano.ImageUrlSource.fromString(data.fileUrl)
//       const geometry = new Marzipano.EquirectGeometry([{ width: 4000 }])
//       const view = new Marzipano.RectilinearView({ yaw: 0, pitch: 0, fov: 80 * Math.PI / 180 })
//       viewRef.current = view

//       const scene = viewer.createScene({ source, geometry, view, pinFirstLevel: true })
//       scene.switchTo({ transitionDuration: 400 })
//       sceneRef.current = scene

//       // pintamos hotspots existentes
//       paintHotspots(data.hotspots)

//       // click para crear nuevo
//       const el = containerRef.current
//       const onClick = (ev: MouseEvent) => {
//         if (!viewRef.current || !sceneRef.current) return
//         const rect = (ev.currentTarget as HTMLDivElement).getBoundingClientRect()
//         const x = ev.clientX - rect.left
//         const y = ev.clientY - rect.top
//         const coords = viewRef.current.screenToCoordinates({ x, y }) // { yaw, pitch }
//         if (!coords) return
//         setTempYawPitch({ yaw: coords.yaw, pitch: coords.pitch })
//         setForm({ type: 'INFORMACION', icon: 'INFO' })
//       }
//       el.addEventListener('click', onClick)

//       return () => {
//         el.removeEventListener('click', onClick)
//         viewer.destroy?.()
//       }
//     })().catch(console.error)

//     return () => { mounted = false }
//   }, [panoId])

//   function paintHotspots(hotspots: Hotspot[]) {
//     if (!sceneRef.current) return
//     const container = sceneRef.current.hotspotContainer()
//     // limpia DOM previo
//     containerRef.current?.querySelectorAll('.mz-hotspot').forEach(n => n.remove())

//     hotspots.forEach(h => {
//       const el = document.createElement('div')
//       el.className = 'mz-hotspot'
//       el.title = h.titulo || h.type
//       el.innerHTML = `
//         <div class="mz-pin ${h.type === 'LINK' ? 'mz-pin-link' : 'mz-pin-info'}"></div>
//         ${h.titulo ? `<div class="mz-label">${h.titulo}</div>` : ''}
//       `
//       // (opcional) click para editar ese hotspot más adelante…
//       container.createHotspot(el, { yaw: h.x, pitch: h.y })
//     })

//     // hotspot temporal (preview)
//     if (tempYawPitch) {
//       const el = document.createElement('div')
//       el.className = 'mz-hotspot mz-temp'
//       el.innerHTML = `<div class="mz-pin mz-pin-temp"></div><div class="mz-label">Nuevo</div>`
//       container.createHotspot(el, { yaw: tempYawPitch.yaw, pitch: tempYawPitch.pitch })
//     }
//   }

//   // repintar cuando cambia el temporal o pano.hotspots
//   useEffect(() => { if (pano) paintHotspots(pano.hotspots) }, [tempYawPitch, pano])

//   async function saveHotspot() {
//     if (!pano || !tempYawPitch || !form) return
//     const payload: any = {
//       panoramaId: pano.id,
//       type: form.type,
//       x: tempYawPitch.yaw,
//       y: tempYawPitch.pitch,
//       z: 0,
//       icon: form.type === 'LINK' ? 'FLECHA' : 'INFO',
//       title: form.titulo || undefined,
//       isActive: true,
//       orderIndex: (pano.hotspots?.length || 0) + 1,
//     }
//     if (form.type === 'LINK') {
//       payload.targetPanoramaId = form.targetPanoramaId
//       payload.transition = 'fade'
//     }

//     const r = await fetchWithAuth(`${BACKEND}/hotspots`, {
//       method: 'POST',
//       headers: { 'Content-Type': 'application/json' },
//       body: JSON.stringify(payload),
//     })
//     if (!r.ok) {
//       const d = await r.json().catch(() => ({}))
//       alert(Array.isArray(d?.message) ? d.message.join(', ') : (d?.message || 'Error al crear hotspot'))
//       return
//     }

//     // recargar panorama con hotspots actualizados
//     const r2 = await fetchWithAuth(`${BACKEND}/panoramas/${pano.id}`)
//     const fresh: PanoramaDTO = await r2.json()
//     setPano(fresh)
//     setTempYawPitch(null)
//     setForm(null)
//   }

//   return (
//     <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,.6)', zIndex: 4000, display: 'flex' }}>
//       <div style={{ flex: 1, position: 'relative' }}>
//         <div ref={containerRef} style={{ width: '100%', height: '100%' }} />
//       </div>

//       {/* Panel derecho */}
//       <div style={{ width: 380, background: '#0b1520', color: '#fff', padding: 16 }}>
//         <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
//           <h3 style={{ margin: 0 }}>Editor de hotspots</h3>
//           <button className="btn-ghost" onClick={onClose}>✕ Cerrar</button>
//         </div>

//         {!pano ? (
//           <p style={{ marginTop: 12 }}>Cargando…</p>
//         ) : (
//           <>
//             <div style={{ marginTop: 12, fontSize: 14, opacity: .9 }}>
//               <div><b>Panorama:</b> {pano.name}</div>
//               <div><b>Oficina:</b> {pano.oficina.nombre}</div>
//               <div><b>Hotspots:</b> {pano.hotspots.length}</div>
//               <p style={{ marginTop: 8, opacity: .85 }}>
//                 Haz <b>click</b> sobre la imagen para crear un hotspot en esa posición.
//               </p>
//             </div>

//             {tempYawPitch && form && (
//               <div className="card" style={{ marginTop: 12, background: '#10283a', border: '1px solid #1e415a', borderRadius: 8, padding: 12 }}>
//                 <h4 style={{ margin: '0 0 8px' }}>Nuevo hotspot</h4>

//                 <label className="input" style={{ display: 'block', marginBottom: 8, background: 'transparent', border: 0, padding: 0 }}>
//                   <span>Tipo</span>
//                   <select
//                     className="select"
//                     value={form.type}
//                     onChange={e => setForm(f => f ? { ...f, type: e.target.value as 'INFORMACION' | 'LINK' } : f)}
//                   >
//                     <option value="INFORMACION">INFORMACION</option>
//                     <option value="LINK">LINK (navegar a otro panorama)</option>
//                   </select>
//                 </label>

//                 <input
//                   className="input"
//                   placeholder="Título (opcional)"
//                   value={form.titulo ?? ''}
//                   onChange={e => setForm(f => f ? { ...f, titulo: e.target.value } : f)}
//                   style={{ marginBottom: 8 }}
//                 />

//                 {form.type === 'LINK' && (
//                   <label style={{ display: 'block', marginBottom: 8 }}>
//                     <div style={{ marginBottom: 4 }}>Destino</div>
//                     <select
//                       className="select"
//                       value={form.targetPanoramaId ?? ''}
//                       onChange={e => setForm(f => f ? { ...f, targetPanoramaId: e.target.value } : f)}
//                     >
//                       <option value="" disabled>Seleccione panorama destino</option>
//                       {allPanos
//                         .filter(p => p.id !== pano.id)
//                         .map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
//                     </select>
//                   </label>
//                 )}

//                 <div style={{ display: 'flex', gap: 8, marginTop: 10 }}>
//                   <button className="btn" onClick={saveHotspot}>Guardar hotspot</button>
//                   <button className="btn-ghost" onClick={() => { setTempYawPitch(null); setForm(null) }}>Cancelar</button>
//                 </div>
//               </div>
//             )}
//           </>
//         )}
//       </div>

//       <style>{`
//         .mz-hotspot { pointer-events: auto; transform: translate(-50%, -50%); text-align: center; }
//         .mz-pin { width: 34px; height: 34px; border-radius: 9999px; border: 3px solid #fff; }
//         .mz-pin-info { background: #147ca6cc; }
//         .mz-pin-link { background: #000000aa; }
//         .mz-pin-temp { background: #33c24dcc; animation: pulse 1.1s infinite; }
//         .mz-label { margin-top: 6px; background: #000; color: #fff; padding: 4px 8px; border-radius: 6px; font-size: 12px; font-weight: 700; border: 1px solid #fff; white-space: nowrap; }
//         @keyframes pulse { 0%{ transform: scale(1);} 50%{ transform: scale(1.1);} 100%{ transform: scale(1);} }
//       `}</style>
//     </div>
//   )
// }
