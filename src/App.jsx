import React, { useEffect, useMemo, useState } from 'react'
import {
  Box, CalendarDays, ChevronLeft, ChevronRight, Download,
  MapPin, Plus, Search, Trash2, Truck, X
} from 'lucide-react'
import {
  Area, AreaChart, CartesianGrid, ResponsiveContainer,
  Tooltip, XAxis, YAxis
} from 'recharts'
import * as XLSX from 'xlsx'
import { hasSupabase, supabase } from './supabase'

const PERIODS = [
  ['daily', 'יומי'],
  ['weekly', 'שבועי'],
  ['monthly', 'חודשי'],
  ['yearly', 'שנתי'],
  ['custom', 'טווח תאריכים'],
]

const pad = n => String(n).padStart(2, '0')
const isoLocal = d => `${d.getFullYear()}-${pad(d.getMonth()+1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`
const dateOnly = d => `${d.getFullYear()}-${pad(d.getMonth()+1)}-${pad(d.getDate())}`
const asDate = value => new Date(value)

function getRange(period, anchor, customStart, customEnd) {
  const d = new Date(anchor)
  let start = new Date(d), end = new Date(d)
  if (period === 'daily') {
    start.setHours(0,0,0,0); end.setHours(23,59,59,999)
  } else if (period === 'weekly') {
    start.setDate(start.getDate() - 6); start.setHours(0,0,0,0)
    end.setHours(23,59,59,999)
  } else if (period === 'monthly') {
    start = new Date(d.getFullYear(), d.getMonth(), 1)
    end = new Date(d.getFullYear(), d.getMonth()+1, 0, 23,59,59,999)
  } else if (period === 'yearly') {
    start = new Date(d.getFullYear(), 0, 1)
    end = new Date(d.getFullYear(), 11, 31, 23,59,59,999)
  } else {
    start = customStart ? new Date(`${customStart}T00:00:00`) : new Date(d)
    end = customEnd ? new Date(`${customEnd}T23:59:59`) : new Date(d)
  }
  return [start, end]
}

function labelForBucket(d, period) {
  if (period === 'daily') return `${pad(d.getHours())}:00`
  if (period === 'yearly') return `${pad(d.getMonth()+1)}/${String(d.getFullYear()).slice(-2)}`
  return `${pad(d.getDate())}/${pad(d.getMonth()+1)}`
}

function bucketKey(d, period) {
  if (period === 'daily') return `${dateOnly(d)}-${pad(d.getHours())}`
  if (period === 'yearly') return `${d.getFullYear()}-${pad(d.getMonth()+1)}`
  return dateOnly(d)
}

function seedRows() {
  const now = new Date()
  const times = [0,1,2,4,6,8,9].map(h => new Date(now.getTime() - h*3600000))
  const locs = ['מחסן מרכזי','נמל אשדוד','רחבה צפונית','מסוף מכולות','שער דרומי']
  return times.map((t,i)=>({
    id: `demo-${i}`,
    container_no: ['MSCU1234567','TCLU7654321','CMAU9876543','GESU1122334','TRHU3344556','OOLU7733551','MSDU9988776'][i],
    agent: ['צים','MSC','CMA CGM','Hapag-Lloyd','Maersk','ONE','Evergreen'][i],
    container_type: i%2 ? 40 : 20,
    current_location: locs[i%locs.length],
    target_location: locs[(i+1)%locs.length],
    movement_at: isoLocal(t)
  }))
}

function App() {
  const [rows, setRows] = useState([])
  const [period, setPeriod] = useState('daily')
  const [anchor, setAnchor] = useState(dateOnly(new Date()))
  const [customStart, setCustomStart] = useState(anchor)
  const [customEnd, setCustomEnd] = useState(anchor)
  const [search, setSearch] = useState('')
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [form, setForm] = useState({
    container_no:'', agent:'', container_type:20, current_location:'', target_location:''
  })

  async function loadRows() {
    setLoading(true)
    if (!hasSupabase) {
      const saved = JSON.parse(localStorage.getItem('container_movements') || 'null')
      setRows(saved || seedRows())
      setLoading(false)
      return
    }
    const { data, error } = await supabase
      .from('container_movements')
      .select('*')
      .order('movement_at', { ascending: false })
    if (error) alert(`שגיאה בטעינת נתונים: ${error.message}`)
    setRows(data || [])
    setLoading(false)
  }

  useEffect(()=>{ loadRows() },[])

  useEffect(()=>{
    if (!hasSupabase && rows.length) {
      localStorage.setItem('container_movements', JSON.stringify(rows))
    }
  },[rows])

  const [rangeStart, rangeEnd] = useMemo(
    ()=>getRange(period, anchor, customStart, customEnd),
    [period, anchor, customStart, customEnd]
  )

  const filtered = useMemo(()=>{
    const q = search.trim().toLowerCase()
    return rows.filter(r=>{
      const d = asDate(r.movement_at)
      const inRange = d >= rangeStart && d <= rangeEnd
      if (!inRange) return false
      if (!q) return true
      return [r.container_no,r.agent,r.current_location,r.target_location,String(r.container_type)]
        .some(v=>String(v||'').toLowerCase().includes(q))
    })
  },[rows, search, rangeStart, rangeEnd])

  const locations = useMemo(()=>{
    const s = new Set()
    rows.forEach(r=>{ if(r.current_location) s.add(r.current_location); if(r.target_location) s.add(r.target_location) })
    return [...s].sort((a,b)=>a.localeCompare(b,'he'))
  },[rows])

  const chartData = useMemo(()=>{
    const map = new Map()
    filtered.forEach(r=>{
      const d = asDate(r.movement_at)
      const k = bucketKey(d, period)
      const item = map.get(k) || { key:k, label:labelForBucket(d,period), count:0, ts:d.getTime() }
      item.count += 1
      map.set(k,item)
    })
    return [...map.values()].sort((a,b)=>a.ts-b.ts)
  },[filtered,period])

  const activeContainers = new Set(filtered.map(r=>r.container_no)).size
  const activeLocations = new Set(filtered.flatMap(r=>[r.current_location,r.target_location])).size

  function shiftAnchor(delta) {
    const d = new Date(`${anchor}T12:00:00`)
    if (period==='daily') d.setDate(d.getDate()+delta)
    else if (period==='weekly') d.setDate(d.getDate()+7*delta)
    else if (period==='monthly') d.setMonth(d.getMonth()+delta)
    else if (period==='yearly') d.setFullYear(d.getFullYear()+delta)
    setAnchor(dateOnly(d))
  }

  async function saveMovement(e) {
    e.preventDefault()
    if (!form.container_no.trim() || !form.agent.trim() || !form.current_location.trim() || !form.target_location.trim()) {
      alert('יש למלא את כל השדות')
      return
    }
    const containerNo = form.container_no.trim().toUpperCase()
    if (!/^[A-Z]{4}[0-9]{7}$/.test(containerNo)) {
      alert('שים לב מס המכולה לא תקין')
      return
    }
    const payload = {
      ...form,
      container_no: containerNo,
      agent: form.agent.trim(),
      container_type: Number(form.container_type),
      current_location: form.current_location.trim(),
      target_location: form.target_location.trim(),
      movement_at: new Date().toISOString()
    }
    if (hasSupabase) {
      const { data, error } = await supabase.from('container_movements').insert(payload).select().single()
      if (error) return alert(`שמירה נכשלה: ${error.message}`)
      setRows(prev=>[data,...prev])
    } else {
      setRows(prev=>[{...payload,id:crypto.randomUUID()},...prev])
    }
    setForm({container_no:'',agent:'',container_type:20,current_location:'',target_location:''})
    setShowForm(false)
  }

  async function deleteRow(id) {
    if (!confirm('למחוק את התנועה הזאת?')) return
    if (hasSupabase) {
      const { error } = await supabase.from('container_movements').delete().eq('id',id)
      if (error) return alert(`המחיקה נכשלה: ${error.message}`)
    }
    setRows(prev=>prev.filter(r=>r.id!==id))
  }

  function exportExcel() {
    const data = filtered.map(r=>({
      'תאריך ושעה': new Date(r.movement_at).toLocaleString('he-IL'),
      'מספר מכולה': r.container_no,
      'סוכן': r.agent,
      'סוג מכולה (פיט)': r.container_type,
      'איתור נוכחי': r.current_location,
      'איתור יעד': r.target_location,
    }))
    const ws = XLSX.utils.json_to_sheet(data)
    ws['!cols'] = [
      {wch:22},{wch:18},{wch:18},{wch:18},{wch:24},{wch:24}
    ]
    ws['!views'] = [{ rightToLeft: true }]
    const wb = XLSX.utils.book_new()
    XLSX.utils.book_append_sheet(wb, ws, 'תנועות')
    const summary = XLSX.utils.aoa_to_sheet([
      ['מעקב מכולות - סיכום'],
      ['מספר תנועות', filtered.length],
      ['מכולות שונות', activeContainers],
      ['איתורים שונים', activeLocations],
      ['מתאריך', rangeStart.toLocaleString('he-IL')],
      ['עד תאריך', rangeEnd.toLocaleString('he-IL')],
    ])
    summary['!views'] = [{ rightToLeft: true }]
    XLSX.utils.book_append_sheet(wb, summary, 'סיכום')
    XLSX.writeFile(wb, `מעקב_מכולות_${dateOnly(rangeStart)}_${dateOnly(rangeEnd)}.xlsx`)
  }

  return (
    <div className="app-shell">
      <div className="water-bg"></div>
      <header className="topbar glass">
        <div className="brand">
          <div className="brand-icon"><Box size={24}/></div>
          <div><h1>מעקב מכולות</h1><span>Container Movement Control</span></div>
        </div>
        <div className="top-actions">
          {!hasSupabase && <span className="offline-badge">מצב מקומי</span>}
          <button className="btn secondary" onClick={exportExcel}><Download size={18}/> יצוא לאקסל</button>
          <button className="btn primary" onClick={()=>setShowForm(true)}><Plus size={18}/> תנועה חדשה</button>
        </div>
      </header>

      <main className="content">
        <section className="filters glass">
          <div className="periods">
            {PERIODS.map(([key,label])=>
              <button key={key} className={period===key?'active':''} onClick={()=>setPeriod(key)}>{label}</button>
            )}
          </div>
          {period !== 'custom' ? (
            <div className="date-nav">
              <button onClick={()=>shiftAnchor(-1)}><ChevronRight/></button>
              <label><CalendarDays size={18}/><input type="date" value={anchor} onChange={e=>setAnchor(e.target.value)}/></label>
              <button onClick={()=>shiftAnchor(1)}><ChevronLeft/></button>
            </div>
          ) : (
            <div className="custom-range">
              <label>מתאריך <input type="date" value={customStart} onChange={e=>setCustomStart(e.target.value)}/></label>
              <label>עד <input type="date" value={customEnd} onChange={e=>setCustomEnd(e.target.value)}/></label>
            </div>
          )}
        </section>

        <section className="cards">
          <div className="kpi glass"><div className="kpi-icon"><Truck/></div><div><span>סה״כ תנועות</span><strong>{filtered.length}</strong></div></div>
          <div className="kpi glass"><div className="kpi-icon"><Box/></div><div><span>מכולות שונות</span><strong>{activeContainers}</strong></div></div>
          <div className="kpi glass"><div className="kpi-icon"><MapPin/></div><div><span>איתורים שונים</span><strong>{activeLocations}</strong></div></div>
          <div className="kpi glass"><div className="kpi-icon"><CalendarDays/></div><div><span>ממוצע תנועות</span><strong>{chartData.length ? Math.round(filtered.length/chartData.length) : 0}</strong></div></div>
        </section>

        <section className="chart-card glass">
          <div className="section-head">
            <div><h2>מספר תנועות מכולות</h2><p>ציר Y — מספר מכולות · ציר X — תאריך / שעה</p></div>
          </div>
          <div className="chart-wrap">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartData}>
                <defs>
                  <linearGradient id="fillBlue" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#2478ff" stopOpacity={0.45}/>
                    <stop offset="100%" stopColor="#2478ff" stopOpacity={0.04}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} opacity={0.22}/>
                <XAxis dataKey="label" tickLine={false} axisLine={false}/>
                <YAxis allowDecimals={false} tickLine={false} axisLine={false}/>
                <Tooltip formatter={(v)=>[v,'תנועות']} labelFormatter={(l)=>`זמן: ${l}`}/>
                <Area type="monotone" dataKey="count" stroke="#2478ff" strokeWidth={3} fill="url(#fillBlue)"/>
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </section>

        <section className="table-card glass">
          <div className="section-head table-head">
            <div><h2>רשימת תנועות</h2><p>{loading ? 'טוען...' : `${filtered.length} רשומות מוצגות`}</p></div>
            <div className="searchbox"><Search size={18}/><input placeholder="חיפוש מכולה, סוכן או איתור..." value={search} onChange={e=>setSearch(e.target.value)}/></div>
          </div>
          <div className="table-scroll">
            <table>
              <thead><tr>
                <th>תאריך ושעה</th><th>מספר מכולה</th><th>סוכן</th><th>סוג</th><th>איתור נוכחי</th><th>איתור יעד</th><th></th>
              </tr></thead>
              <tbody>
              {filtered.map(r=><tr key={r.id}>
                <td>{new Date(r.movement_at).toLocaleString('he-IL')}</td>
                <td className="mono">{r.container_no}</td>
                <td>{r.agent}</td>
                <td><span className="type-pill">{r.container_type} פיט</span></td>
                <td><span className="location"><MapPin size={14}/>{r.current_location}</span></td>
                <td><span className="location"><MapPin size={14}/>{r.target_location}</span></td>
                <td><button className="icon-btn danger" onClick={()=>deleteRow(r.id)} title="מחיקה"><Trash2 size={17}/></button></td>
              </tr>)}
              {!filtered.length && <tr><td colSpan="7" className="empty">אין תנועות בטווח שנבחר</td></tr>}
              </tbody>
            </table>
          </div>
        </section>
      </main>

      {showForm && <div className="modal-backdrop" onMouseDown={e=>e.target===e.currentTarget && setShowForm(false)}>
        <form className="movement-modal glass" onSubmit={saveMovement}>
          <div className="modal-title"><div><h2>הוספת תנועה חדשה</h2><p>התאריך והשעה נלקחים אוטומטית מהמחשב</p></div><button type="button" className="icon-btn" onClick={()=>setShowForm(false)}><X/></button></div>
          <div className="form-grid">
            <label>מספר מכולה<input autoFocus value={form.container_no} onChange={e=>setForm({...form,container_no:e.target.value})} maxLength={11} placeholder="לדוגמה MSCU1234567"/></label>
            <label>סוכן<input value={form.agent} onChange={e=>setForm({...form,agent:e.target.value})} placeholder="שם הסוכן"/></label>
            <label>סוג מכולה<select value={form.container_type} onChange={e=>setForm({...form,container_type:e.target.value})}><option value="20">20 פיט</option><option value="40">40 פיט</option></select></label>
            <label>איתור נוכחי<input list="locations" value={form.current_location} onChange={e=>setForm({...form,current_location:e.target.value})} placeholder="הקלד או בחר איתור"/></label>
            <label>איתור יעד<input list="locations" value={form.target_location} onChange={e=>setForm({...form,target_location:e.target.value})} placeholder="הקלד או בחר איתור"/></label>
            <label>תאריך ושעה<input value={new Date().toLocaleString('he-IL')} disabled/></label>
          </div>
          <datalist id="locations">{locations.map(l=><option value={l} key={l}/>)}</datalist>
          <button className="btn primary wide" type="submit">שמור תנועה</button>
        </form>
      </div>}
    </div>
  )
}

export default App
