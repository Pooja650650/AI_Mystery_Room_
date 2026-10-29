import { useEffect, useMemo, useState } from 'react';
import {
  ArrowLeft, ArrowRight, ArrowUpRight, Check, CheckCircle2, ChevronDown,
  Clock3, FileText, Fingerprint, History, Image, Lightbulb, LoaderCircle,
  LockKeyhole, Menu, MessageSquare, Search, Shield, Sparkles, Users, Video,
  X,
} from 'lucide-react';

const demoMystery = {
  id: 'demo-midnight-express',
  title: 'The Last Train to Blackwood',
  intro: 'At 11:42 PM, celebrated botanist Dr. Evelyn Shaw vanished from a locked first-class carriage. The train never stopped. Four people had a reason to want her research gone.',
  incident: 'A locked-room disappearance aboard the midnight express',
  difficulty: 'Medium',
  suspects: [
    { id: 's1', name: 'Arthur Finch', role: 'The conductor', motive: 'Dr. Shaw had filed a formal complaint after he ignored a safety warning.', alibi: 'Says he was checking tickets in the rear carriage from 11:30 to midnight.', background: 'A railway veteran who knows every service passage aboard the train.', initials: 'AF', color: 'clay' },
    { id: 's2', name: 'Mina Vale', role: 'The research assistant', motive: 'Her name was missing from the patent that would make the research worth millions.', alibi: 'Claims she was in the dining car, alone, writing in her notebook.', background: 'Worked alongside Dr. Shaw for three years and knew the research intimately.', initials: 'MV', color: 'sage' },
    { id: 's3', name: 'Professor Elias Reed', role: 'The rival botanist', motive: 'His competing paper had just been disproved by Dr. Shaw’s findings.', alibi: 'Was in his compartment on a phone call with his university.', background: 'A brilliant but famously combative academic traveling to the same symposium.', initials: 'ER', color: 'plum' },
    { id: 's4', name: 'Clara Bell', role: 'The journalist', motive: 'She was promised an exclusive interview that Dr. Shaw canceled at the last moment.', alibi: 'Says she was in the observation car developing film.', background: 'A freelance reporter with a press badge and an old film camera.', initials: 'CB', color: 'blue' },
  ],
  evidence: [
    { id: 'e1', type: 'document', label: 'The ticket ledger', title: 'The ticket ledger', description: 'A carbon-copy conductor’s log recovered from the service desk.', content: '11:34 PM — A first-class ticket for Carriage 3 was punched. The ink is still wet, but the handwriting does not match Finch’s entries elsewhere in the book.\n\n11:51 PM — Finch records a routine walk-through of Carriage 2. There is no entry for Carriage 3.' },
    { id: 'e2', type: 'chat', label: 'Recovered messages', title: 'A conversation after midnight', description: 'Messages extracted from the station’s backup terminal.', content: '11:18 PM — Mina: You said the formula would be mine too.\n11:21 PM — Evelyn: I said we would talk after the symposium.\n11:23 PM — Mina: There won’t be a symposium if you publish that draft.\n\nThe message thread ends here. The terminal timestamp is verified; the sender identity is not.', relatedSuspect: 's2' },
    { id: 'e3', type: 'cctv', label: 'Platform camera', title: 'Platform 6 · Camera 03', description: 'A 90-second gap appears in the station’s platform footage.', content: '11:39:12 PM — Train doors close. Clara Bell is visible at the far end of Platform 6, carrying a small black case.\n\n11:40:02 PM — The camera feed drops for 90 seconds. The maintenance log says the disruption was caused by a loose relay, not a manual override.' },
    { id: 'e4', type: 'witness', label: 'Dining car statement', title: 'A witness remembers', description: 'Statement from the dining car steward, recorded at the next station.', content: '“I served tea to Professor Reed at 11:35. He was reading a paper, not speaking on the phone. Later I saw Miss Vale return the untouched tea to the counter. She asked me whether the connecting door to Carriage 3 was still unlocked.”', relatedSuspect: 's2' },
    { id: 'e5', type: 'image', label: 'A pressed flower', title: 'The pressed flower', description: 'Found inside the lining of a discarded first-class ticket.', content: 'A rare moon orchid, flattened carefully between the ticket layers. Its pollen stains the inside of the paper, meaning the flower was placed there before the ticket was used. Dr. Shaw had been researching this exact species.' },
    { id: 'e6', type: 'timeline', label: 'Station timeline', title: 'Last confirmed sightings', description: 'A timeline assembled from station clocks and witness accounts.', content: '11:18 PM · Mina and Evelyn exchange messages.\n11:34 PM · A Carriage 3 ticket is punched.\n11:35 PM · Reed is seen in the dining car.\n11:39 PM · Clara is seen on Platform 6.\n11:42 PM · Evelyn’s compartment is found locked and empty.\n11:51 PM · Finch logs a walk-through of Carriage 2.' },
  ],
  timeline: [
    { time: '11:18 PM', event: 'The last message between Evelyn and Mina is sent.' },
    { time: '11:34 PM', event: 'An unaccounted first-class ticket is punched.' },
    { time: '11:39 PM', event: 'Clara Bell is spotted on Platform 6.' },
    { time: '11:42 PM', event: 'Evelyn Shaw is reported missing.' },
  ],
};

const evidenceIcon = { chat: MessageSquare, image: Image, cctv: Video, witness: Users, timeline: Clock3, document: FileText };
const fmtDate = (date) => new Intl.DateTimeFormat('en', { month: 'short', day: 'numeric', year: 'numeric' }).format(new Date(date));
const apiFetch = (url, options = {}) => {
  let sessionId = localStorage.getItem('mystery-room-session');
  if (!sessionId) { sessionId = crypto.randomUUID(); localStorage.setItem('mystery-room-session', sessionId); }
  return fetch(url, { ...options, headers: { 'x-session-id': sessionId, ...(options.headers || {}) } });
};

export default function App() {
  const [mystery, setMystery] = useState(null);
  const [scenario, setScenario] = useState('A botanist disappears from a locked train carriage on an overnight journey. Four people had the means and motive to make her vanish.');
  const [difficulty, setDifficulty] = useState('Medium');
  const [activeTab, setActiveTab] = useState('evidence');
  const [selectedEvidence, setSelectedEvidence] = useState(null);
  const [selectedSuspect, setSelectedSuspect] = useState(null);
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [history, setHistory] = useState([]);
  const [showHistory, setShowHistory] = useState(false);
  const [confirming, setConfirming] = useState(false);
  const [filter, setFilter] = useState('all');

  useEffect(() => { apiFetch('/api/mysteries/history').then((r) => r.ok ? r.json() : []).then(setHistory).catch(() => {}); }, []);
  useEffect(() => { if (showHistory) apiFetch('/api/mysteries/history').then((r) => r.ok ? r.json() : []).then(setHistory).catch(() => {}); }, [showHistory]);

  const beginMystery = async (useDemo = false) => {
    setLoading(true); setError(''); setResult(null); setSelectedSuspect(null); setSelectedEvidence(null); setActiveTab('evidence');
    try {
      if (useDemo) {
        await new Promise((resolve) => setTimeout(resolve, 650));
        setMystery(demoMystery);
      } else {
        const response = await apiFetch('/api/mysteries/generate', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ scenario, difficulty }) });
        const body = await response.json();
        if (!response.ok) throw new Error(body.error || 'We couldn’t create this investigation. Please try again.');
        setMystery(body);
        setHistory((items) => [body, ...items.filter((item) => item.id !== body.id)]);
      }
    } catch (err) { setError(err.message); }
    finally { setLoading(false); }
  };

  const submitAccusation = async () => {
    if (!mystery || !selectedSuspect) return;
    if (mystery.id === demoMystery.id) {
      setResult({ isCorrect: selectedSuspect === 's2', culprit: demoMystery.suspects.find((s) => s.id === 's2'), reasoning: 'Mina had the strongest motive, and the clues place her in the connecting carriage. The messages show the dispute over the research, while the steward’s statement contradicts her claimed alibi. The freshly punched ticket gave her access to Carriage 3 without appearing in the official log.', decisiveEvidence: demoMystery.evidence.filter((e) => ['e1', 'e2', 'e4', 'e6'].includes(e.id)) });
      setConfirming(false); return;
    }
    try {
      const response = await apiFetch(`/api/mysteries/${mystery.id}/submit`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ selectedSuspectId: selectedSuspect }) });
      const body = await response.json(); if (!response.ok) throw new Error(body.error || 'We couldn’t submit your answer.');
      setResult(body); setConfirming(false);
      setHistory((items) => items.map((item) => item.id === mystery.id ? { ...item, selectedSuspect: mystery.suspects.find((s) => s.id === selectedSuspect)?.name, isCorrect: body.isCorrect } : item));
    } catch (err) { setError(err.message); setConfirming(false); }
  };

  const openHistoryItem = async (item) => {
    try {
      if (item.id === demoMystery.id) { setMystery(demoMystery); setResult(null); setShowHistory(false); return; }
      const response = await apiFetch(`/api/mysteries/${item.id}`); const body = await response.json();
      if (response.ok) {
        setMystery(body); setResult(null);
        if (item.selectedSuspect) {
          const resultResponse = await apiFetch(`/api/mysteries/${item.id}/result`);
          if (resultResponse.ok) setResult(await resultResponse.json());
        }
        setShowHistory(false);
      }
    } catch { setError('This investigation could not be opened.'); }
  };

  const visibleEvidence = useMemo(() => {
    if (!mystery) return [];
    return filter === 'all' ? mystery.evidence : mystery.evidence.filter((e) => e.type === filter);
  }, [mystery, filter]);

  const startOver = () => { setMystery(null); setResult(null); setSelectedSuspect(null); setError(''); };

  return (
    <div className="app-shell">
      <header className="topbar">
        <button className="brand" onClick={startOver} aria-label="The Mystery Room home">
          <span className="brand-mark"><Fingerprint size={19} strokeWidth={1.8} /></span>
          <span className="brand-name">THE <b>MYSTERY</b> ROOM<span className="brand-period">.</span></span>
        </button>
        <div className="topbar-right">
          <span className="private-label"><LockKeyhole size={13} /> YOUR PRIVATE CASE FILE</span>
          <button className="history-button" onClick={() => setShowHistory(true)}><History size={16} /><span>Case history</span>{history.length > 0 && <span className="history-count">{history.length}</span>}</button>
          <button className="mobile-menu" onClick={() => setShowHistory(true)} aria-label="Open case history"><Menu size={20} /></button>
        </div>
      </header>

      {!mystery ? (
        <main className="landing">
          <div className="landing-copy">
            <div className="eyebrow"><span className="eyebrow-line" /> AN INTERACTIVE DETECTIVE EXPERIENCE</div>
            <h1>Every clue<br />has a <em>story.</em></h1>
            <p className="landing-description">Create a mystery from your imagination. Follow the evidence. Find out what really happened.</p>
            <div className="landing-meta"><span><Shield size={15} /> Fictional cases, generated for you</span><span><LockKeyhole size={14} /> Your solution stays secret</span></div>
            <div className="case-stamp"><Fingerprint size={20} /><span>CASE FILE</span><b>001 — OPEN</b></div>
          </div>
          <section className="create-card" aria-labelledby="create-title">
            <div className="card-topline"><span>NEW INVESTIGATION</span><span className="card-number">FILE № 001</span></div>
            <h2 id="create-title">Set the scene.</h2>
            <p className="card-intro">Give us the outline. We’ll build the mystery around it.</p>
            <label className="field-label" htmlFor="scenario">YOUR SCENARIO <span>UP TO 1,200 CHARACTERS</span></label>
            <div className="textarea-wrap">
              <textarea id="scenario" maxLength={1200} value={scenario} onChange={(e) => setScenario(e.target.value)} placeholder="A jewel disappears during a storm at an isolated hotel…" />
              <span className="char-count">{scenario.length} / 1,200</span>
            </div>
            <div className="form-row"><div><span className="field-label">DIFFICULTY</span><div className="difficulty-select"><select value={difficulty} onChange={(e) => setDifficulty(e.target.value)}><option>Easy</option><option>Medium</option><option>Hard</option></select><ChevronDown size={14} /></div></div><span className="difficulty-note">{difficulty === 'Easy' ? 'Clear clues. Gentle red herrings.' : difficulty === 'Hard' ? 'Subtle clues. No easy answers.' : 'A fair case with a few twists.'}</span></div>
            {error && <div className="error-message" role="alert">{error}</div>}
            <button className="generate-button" onClick={() => beginMystery(false)} disabled={loading || scenario.trim().length < 15}>
              {loading ? <><LoaderCircle className="spin" size={17} /> Building your case…</> : <><Sparkles size={17} /> Generate my mystery <ArrowRight size={17} /></>}
            </button>
            <div className="divider"><span /> <small>OR TAKE A LOOK AROUND</small> <span /></div>
            <button className="demo-button" onClick={() => beginMystery(true)} disabled={loading}><Search size={15} /> Explore a sample case <ArrowUpRight size={14} /></button>
            <p className="fiction-note"><LockKeyhole size={12} /> All cases are fictional. No real people or events.</p>
          </section>
          <div className="landing-foot"><span>01 / BUILD A CASE</span><span>02 / FOLLOW THE CLUES</span><span>03 / MAKE YOUR CALL</span><span className="foot-mark">MR — 2025</span></div>
          <div className="background-watermark" aria-hidden="true">01</div>
        </main>
      ) : (
        <main className="investigation-page">
          <div className="case-toolbar"><button className="back-button" onClick={startOver}><ArrowLeft size={15} /> All cases</button><span className="case-id"><span className="live-dot" /> ACTIVE INVESTIGATION <i>·</i> {mystery.difficulty.toUpperCase()} <i>·</i> CASE {mystery.id.slice(-5).toUpperCase()}</span><span className="fiction-pill"><Shield size={13} /> FICTIONAL CASE</span></div>
          <div className="case-heading"><div className="case-heading-main"><div className="eyebrow"><span className="eyebrow-line" /> INVESTIGATION DOSSIER</div><h1>{mystery.title}</h1><p>{mystery.intro}</p></div><div className="case-status"><span>CASE STATUS</span><b><i className="live-dot" /> OPEN</b><small>Generated just now</small></div></div>
          <div className="investigation-grid">
            <section className="main-panel">
              <div className="panel-tabs"><button onClick={() => {setActiveTab('evidence'); setSelectedEvidence(null);}} className={activeTab === 'evidence' ? 'active' : ''}><Search size={15} /> Evidence room <span className="tab-count">{mystery.evidence.length}</span></button><button onClick={() => {setActiveTab('suspects'); setSelectedEvidence(null);}} className={activeTab === 'suspects' ? 'active' : ''}><Users size={15} /> Suspects <span className="tab-count">{mystery.suspects.length}</span></button><span className="panel-tab-spacer"/><span className="panel-classification"><LockKeyhole size={12} /> INVESTIGATOR ACCESS</span></div>
              {result ? <ResultView result={result} onNewCase={startOver} /> : activeTab === 'evidence' ? (
                selectedEvidence ? <EvidenceDetail evidence={selectedEvidence} onBack={() => setSelectedEvidence(null)} /> : <div className="evidence-content">
                  <div className="section-heading"><div><div className="section-kicker">THE FILES</div><h2>Collected evidence</h2></div><span className="subtle-count">{visibleEvidence.length} ITEMS</span></div>
                  <div className="filter-row"><button className={filter === 'all' ? 'selected' : ''} onClick={() => setFilter('all')}>All evidence</button>{['chat','cctv','witness','document','timeline','image'].map((type) => <button key={type} className={filter === type ? 'selected' : ''} onClick={() => setFilter(filter === type ? 'all' : type)}>{type === 'cctv' ? 'CCTV' : type === 'chat' ? 'Messages' : type === 'witness' ? 'Witnesses' : type === 'timeline' ? 'Timeline' : type === 'image' ? 'Objects' : 'Documents'}</button>)}</div>
                  <div className="evidence-list">{visibleEvidence.map((item, i) => <EvidenceRow key={item.id} item={item} index={i + 1} onClick={() => setSelectedEvidence(item)} />)}</div>
                  <div className="evidence-reminder"><Lightbulb size={15} /><p>Look for what doesn’t fit. A timeline can be just as telling as a confession.</p></div>
                </div>
              ) : <div className="suspect-content"><div className="section-heading"><div><div className="section-kicker">PERSONS OF INTEREST</div><h2>Meet the suspects</h2></div><span className="subtle-count">{mystery.suspects.length} PROFILES</span></div><p className="suspect-warning"><LockKeyhole size={13} /> Motives are not proof. Read each profile, then inspect the evidence.</p><div className="suspect-grid">{mystery.suspects.map((person) => <SuspectCard key={person.id} suspect={person} selected={selectedSuspect === person.id} disabled={!!result} onSelect={() => setSelectedSuspect(person.id)} />)}</div></div>}
            </section>
            <aside className="sidebar"><section className="sidebar-card overview-card"><div className="sidebar-heading"><span>CASE OVERVIEW</span><span className="pin-dot" /></div><p className="incident-label">THE INCIDENT</p><p className="incident-text">{mystery.incident}</p><div className="overview-divider"/><div className="overview-stat"><span><Users size={14} /> Persons of interest</span><b>{mystery.suspects.length}</b></div><div className="overview-stat"><span><FileText size={14} /> Evidence collected</span><b>{mystery.evidence.length} items</b></div><div className="overview-stat"><span><Clock3 size={14} /> Case opened</span><b>Just now</b></div></section>
              <section className="sidebar-card timeline-card"><div className="sidebar-heading"><span>KNOWN TIMELINE</span><span className="muted-mono">LOCAL TIME</span></div><div className="timeline">{mystery.timeline?.map((item, i) => <div className="timeline-item" key={`${item.time}-${i}`}><span className="timeline-marker"/><span className="timeline-time">{item.time}</span><p>{item.event}</p></div>)}</div></section>
              <section className="accusation-card"><div className="accusation-top"><Fingerprint size={20}/><span>YOUR CONCLUSION</span></div><h3>Who’s responsible?</h3><p>Review the evidence, then make your accusation.</p><button className="accuse-button" onClick={() => setActiveTab('suspects')} disabled={!!result}>{selectedSuspect ? `Selected: ${mystery.suspects.find((s) => s.id === selectedSuspect)?.name}` : 'Choose a suspect'} <ArrowRight size={15}/></button><div className="answer-privacy"><LockKeyhole size={12}/> Your choice locks after submission</div></section>
            </aside>
          </div>
          {!result && <div className="submit-bar"><div><span className="submit-icon"><Fingerprint size={16}/></span><span><b>Ready to make your call?</b><small>Once submitted, your accusation is final.</small></span></div><button className="submit-button" disabled={!selectedSuspect} onClick={() => setConfirming(true)}>Submit accusation <ArrowRight size={15}/></button></div>}
          <div className="investigation-footer"><span>THE MYSTERY ROOM <i>·</i> ALL EVIDENCE IS FICTIONAL</span><span>CASE {mystery.id.slice(-5).toUpperCase()}</span></div>
        </main>
      )}

      {confirming && <div className="modal-backdrop" role="presentation" onMouseDown={(e) => e.target === e.currentTarget && setConfirming(false)}><div className="confirm-modal" role="dialog" aria-modal="true" aria-labelledby="confirm-title"><button className="modal-close" onClick={() => setConfirming(false)} aria-label="Close"><X size={18}/></button><div className="modal-seal"><Fingerprint size={25}/></div><div className="section-kicker">FINAL ACCUSATION</div><h2 id="confirm-title">Lock in your answer?</h2><p>You’re accusing <b>{mystery?.suspects.find((s) => s.id === selectedSuspect)?.name}</b>. This can’t be changed once submitted.</p><div className="modal-actions"><button className="cancel-button" onClick={() => setConfirming(false)}>Keep investigating</button><button className="submit-button" onClick={submitAccusation}>Confirm accusation <ArrowRight size={15}/></button></div></div></div>}
      {showHistory && <div className="drawer-backdrop" onMouseDown={(e) => e.target === e.currentTarget && setShowHistory(false)}><aside className="history-drawer"><div className="drawer-head"><div><div className="section-kicker">YOUR ARCHIVE</div><h2>Case history</h2></div><button className="modal-close" onClick={() => setShowHistory(false)} aria-label="Close history"><X size={18}/></button></div><p className="drawer-description">The files you’ve opened, all in one place.</p><div className="history-list">{history.map((item) => <button className="history-item" key={item.id} onClick={() => openHistoryItem(item)}><span className="history-file"><FileText size={18}/></span><span><b>{item.title}</b><small>{item.difficulty} <i>·</i> {item.createdAt ? fmtDate(item.createdAt) : 'Just now'}</small></span><ArrowUpRight size={15}/></button>)}{history.length === 0 && <div className="empty-history"><span><History size={22}/></span><b>No cases in your archive yet.</b><p>Your investigations will show up here.</p></div>}</div><button className="drawer-new-case" onClick={() => {setShowHistory(false); startOver();}}>Start a new case <ArrowRight size={15}/></button><p className="drawer-foot"><LockKeyhole size={12}/> History is stored on this device or case server.</p></aside></div>}
    </div>
  );
}

function EvidenceRow({ item, index, onClick }) {
  const Icon = evidenceIcon[item.type] || FileText;
  return <button className="evidence-row" onClick={onClick}><span className={`evidence-type type-${item.type}`}><Icon size={17}/></span><span className="evidence-num">{String(index).padStart(2,'0')}</span><span className="evidence-row-main"><b>{item.title}</b><small>{item.description}</small></span><span className="evidence-kind">{item.type === 'cctv' ? 'CCTV' : item.type.toUpperCase()}</span><ArrowUpRight className="evidence-open" size={16}/></button>;
}

function EvidenceDetail({ evidence, onBack }) {
  const Icon = evidenceIcon[evidence.type] || FileText;
  return <div className="evidence-detail"><button className="back-button detail-back" onClick={onBack}><ArrowLeft size={15}/> Back to evidence</button><div className="detail-meta"><span className={`evidence-type type-${evidence.type}`}><Icon size={17}/></span><span>{evidence.type === 'cctv' ? 'CCTV FOOTAGE' : evidence.type.toUpperCase()} <i>·</i> EVIDENCE ITEM</span><span className="fiction-pill"><Shield size={12}/> FICTIONAL</span></div><div className="section-kicker">EVIDENCE EXHIBIT</div><h2>{evidence.title}</h2><p className="detail-description">{evidence.description}</p><div className={`evidence-transcript transcript-${evidence.type}`}><div className="transcript-head"><span><span className="live-dot"/> EXHIBIT CONTENT</span><span>RECORD VERIFIED</span></div><p>{evidence.content}</p></div><div className="detail-hint"><Lightbulb size={16}/><span>Consider how this fits with the other evidence. Look for details that confirm — or contradict — someone’s account.</span></div></div>;
}

function SuspectCard({ suspect, selected, disabled, onSelect }) {
  return <button className={`suspect-card ${selected ? 'suspect-selected' : ''}`} disabled={disabled} onClick={onSelect}><div className="suspect-top"><span className={`suspect-avatar avatar-${suspect.color}`}>{suspect.initials}</span><span className="suspect-select-indicator">{selected && <Check size={13}/>}</span></div><div className="suspect-name">{suspect.name}</div><div className="suspect-role">{suspect.role}</div><div className="suspect-divider"/><div className="suspect-fact"><span>POSSIBLE MOTIVE</span><p>{suspect.motive}</p></div><div className="suspect-fact"><span>STATED ALIBI</span><p>{suspect.alibi}</p></div><div className="suspect-background">{suspect.background}</div></button>;
}

function ResultView({ result, onNewCase }) {
  return <div className="result-view"><div className={`result-banner ${result.isCorrect ? 'result-correct' : 'result-incorrect'}`}><span className="result-mark">{result.isCorrect ? <CheckCircle2 size={22}/> : <Fingerprint size={22}/>}</span><div><div className="section-kicker">CASE CLOSED</div><h2>{result.isCorrect ? 'A sharp eye. The case is yours.' : 'The evidence led somewhere else.'}</h2><p>{result.isCorrect ? 'Your accusation was correct.' : 'Your accusation wasn’t correct this time.'}</p></div><span className="result-stamp">{result.isCorrect ? 'SOLVED' : 'REVIEWED'}</span></div><div className="solution-card"><div className="section-kicker">THE TRUTH BEHIND THE CASE</div><h3>{result.culprit?.name || 'The culprit'}</h3><p className="solution-role">{result.culprit?.role}</p><div className="solution-divider"/><h4>How the clues fit together</h4><p className="solution-copy">{result.reasoning}</p></div><div className="decisive-evidence"><div className="section-heading"><div><div className="section-kicker">THE BREAKTHROUGH</div><h3>Decisive evidence</h3></div></div>{result.decisiveEvidence?.map((item, i) => {const Icon = evidenceIcon[item.type] || FileText; return <div className="decisive-row" key={item.id}><span className="decisive-number">0{i + 1}</span><Icon size={16}/><span><b>{item.title}</b><small>{item.description}</small></span></div>;})}</div><button className="new-case-button" onClick={onNewCase}>Open another case <ArrowRight size={15}/></button></div>;
}
