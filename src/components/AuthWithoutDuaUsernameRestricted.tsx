import * as React from "react";
import { Button, useAuthenticator } from "@aws-amplify/ui-react";

const USER_LOCAL_KEY = "userForm.pending";

type UserForm = {
  // Required (Basic Information + SSA Profile)
  firstName: string;
  lastName: string;
  email: string;            
  username: string;         // non-traceable handle
  characters?: string[];    // up to 5 favorites


};



const SESAME_CHARACTERS = [
  "Big Bird", "Elmo", "Cookie Monster", "Abby Cadabby", "Bert", "Ernie",
  "Oscar the Grouch", "Grover", "Rosita", "Zoe", "The Count", "Telly",
  "Prairie Dawn", "Baby Bear", "Julia",
];

// —— Helpers ——
const emailRe = /^[^@\s]+@[^@\s]+\.[^@\s]+$/i;

const toxicDenylist = [
  // keep brief & SFW here; extend server-side for real screening
  "kill", "hate", "slur", "nsfw", "sex", "violence",
];
function isToxic(s: string) {
  const lower = s.toLowerCase();
  return toxicDenylist.some(w => lower.includes(w));
}
// function toChips(s: string, max: number) {
//   return s.split(/[,\n]/).map(t => t.trim()).filter(Boolean).slice(0, max);
// }
function uniqPreserve<T>(arr: T[], max: number) {
  const seen = new Set<string>();
  const out: T[] = [];
  for (const x of arr) {
    const key = String(x).toLowerCase();
    if (!seen.has(key)) {
      seen.add(key);
      out.push(x);
      if (out.length >= max) break;
    }
  }
  return out;
}
function makeUsername() {
  // fun but safe generator (feel free to change the lists)
  const left = ["muppet", "fuzzy", "silly", "spark", "noodle", "giggle", "scribble", "sunny", "bouncy", "pebble"];
  const right = ["sprout", "glimmer", "wink", "puddle", "tinker", "button", "biscuit", "doodle", "whistle", "twirl"];
  const n = Math.floor(100 + Math.random() * 900);
  const candidate = `${left[Math.floor(Math.random()*left.length)]}-${right[Math.floor(Math.random()*right.length)]}-${n}`;
  return candidate;
}

// // —— Tag editors ——
// function TagEditor({
//   label,
//   value,
//   setValue,
//   suggestions,
//   max,
//   placeholder,
// }: {
//   label: string;
//   value: string[];
//   setValue: (v: string[]) => void;
//   suggestions?: string[];
//   max: number;
//   placeholder?: string;
// }) {
//   const [input, setInput] = React.useState("");

//   function addFromInput() {
//     const chips = toChips(input, max - value.length);
//     if (!chips.length) return;
//     const merged = uniqPreserve([...value, ...chips], max);
//     setValue(merged);
//     setInput("");
//   }
//   return (
//     <div>
//       <label className="block text-sm font-medium">{label}</label>
//       <div className="mt-1 flex gap-2">
//         <input
//           className="w-full rounded-md border px-3 py-2"
//           value={input}
//           onChange={(e) => setInput(e.target.value)}
//           onKeyDown={(e) => {
//             if (e.key === "Enter" || e.key === ",") {
//               e.preventDefault();
//               addFromInput();
//             }
//           }}
//           placeholder={placeholder ?? `Type and press Enter (max ${max})`}
//           list={suggestions ? `${label}-list` : undefined}
//         />
//         <button type="button" className="rounded-md border px-3 py-2" onClick={addFromInput}>Add</button>
//       </div>
//       {suggestions && (
//         <datalist id={`${label}-list`}>
//           {suggestions.map(s => <option value={s} key={s} />)}
//         </datalist>
//       )}
//       {value.length > 0 && (
//         <div className="mt-2 flex flex-wrap gap-2">
//           {value.map((chip, i) => (
//             <span key={`${chip}-${i}`} className="inline-flex items-center gap-1 rounded-full border px-2 py-1 text-xs">
//               {chip}
//               <button type="button" className="opacity-60 hover:opacity-100" onClick={() => setValue(value.filter((_, idx) => idx !== i))}>×</button>
//             </span>
//           ))}
//         </div>
//       )}
//       <p className="mt-1 text-xs text-gray-500">Up to {max}. Use commas or Enter to add multiple.</p>
//     </div>
//   );
// }

function MultiCheckbox({
  label,
  options,
  value,
  setValue,
  max,
}: {
  label: string;
  options: string[];
  value: string[];
  setValue: (v: string[]) => void;
  max: number;
}) {
  function toggle(opt: string) {
    const has = value.includes(opt);
    let next = has ? value.filter(o => o !== opt) : [...value, opt];
    next = uniqPreserve(next, max);
    setValue(next);
  }
  return (
    <div>
      <label className="block text-sm font-medium">{label}</label>
      <div className="mt-2 grid grid-cols-2 gap-2 sm:grid-cols-3">
        {options.map(opt => (
          <label key={opt} className="inline-flex items-center gap-2">
            <input
              type="checkbox"
              checked={value.includes(opt)}
              onChange={() => toggle(opt)}
            />
            <span className="text-sm">{opt}</span>
          </label>
        ))}
      </div>
      <p className="mt-1 text-xs text-gray-500">Select up to {max}.</p>
    </div>
  );
}

export default function AuthWithoutDua({ onAgreed }: { onAgreed: () => void }) {
  const { toSignUp } = useAuthenticator();
  const [open, setOpen] = React.useState(false);

  // Form state
  const agree = React.useState(true);

  const [firstName, setFirstName] = React.useState("");
  const [lastName, setLastName]   = React.useState("");
  const [email, setEmail]         = React.useState("");

  const [username, setUsername]   = React.useState("");

  const [characters, setCharacters]   = React.useState<string[]>([]);



  const [err, setErr] = React.useState<string | null>(null);

  const valid = React.useMemo(() => {
    if (!agree) return false;
    if (!firstName || !lastName ) return false;
    if (!email || !emailRe.test(email)) return false;
    if (!username || isToxic(username)) return false;
    if (characters.length > 5) return false;
    return true;
  }, [agree, firstName, lastName, email, username, characters]);

  function queueAndGo() {
    if (!valid) {
      setErr(
        !agree
          ? "Please check the agreement box."
          : isToxic(username)
          ? "Please choose a different username (failed safety check)."
          : "Please complete required fields and fix any invalid entries."
      );
      return;
    }
    setErr(null);
    const payload: UserForm = {
      firstName, lastName, 
      email, username,
 
      characters: characters.length ? characters : undefined,

    };
    localStorage.setItem(USER_LOCAL_KEY, JSON.stringify(payload));
    setOpen(false);
    onAgreed();
    toSignUp();
  }

  return (
    <>
      <Button onClick={() => setOpen(true)}>Create account</Button>

      {open && (
        <div className="fixed inset-0 z-50 overflow-y-auto" role="dialog" aria-modal="true" aria-labelledby="dua-title">
          <div className="flex min-h-full items-center justify-center p-4 bg-black/20 backdrop-blur-sm">
            <div className="w-[95vw] sm:w-[90vw] lg:w-[80vw] max-w-screen-2xl rounded-2xl bg-white shadow-2xl">
              <div className="grid max-h-[90vh] grid-rows-[auto_1fr_auto]">
                <header className="px-6 py-4 border-b">
                  <h2 id="dua-title" className="text-2xl font-semibold text-left">Create User</h2>
                </header>

                <main className="px-6 py-4 overflow-y-auto space-y-6" style={{ WebkitOverflowScrolling: "touch", overscrollBehavior: "contain" as any }}>


                  {/* Basic Information */}
                  <section className="space-y-3">
                    <h3 className="text-lg font-semibold">Basic Information</h3>
                    <div className="grid gap-3 sm:grid-cols-2">
                      <div>
                        <label className="block text-sm font-medium">First Name *</label>
                        <input className="mt-1 w-full rounded-md border px-3 py-2" value={firstName} onChange={(e)=>setFirstName(e.target.value)} />
                      </div>
                      <div>
                        <label className="block text-sm font-medium">Last Name *</label>
                        <input className="mt-1 w-full rounded-md border px-3 py-2" value={lastName} onChange={(e)=>setLastName(e.target.value)} />
                      </div>
                    </div>
    
                    <div className="grid gap-3 sm:grid-cols-2">
                      <div>
                        <label className="block text-sm font-medium">Email *</label>
                        <input type="email" className="mt-1 w-full rounded-md border px-3 py-2" value={email} onChange={(e)=>setEmail(e.target.value)} />
                      </div>
         
                    </div>
                  </section>


                  {/* SSA Profile */}
                  <section className="space-y-3">
                    
                    <h3 className="text-lg font-semibold">SSA Profile</h3>
                            <MultiCheckbox
                      label="Favorite Sesame Street Character(s) (up to 5)"
                      options={SESAME_CHARACTERS}
                      value={characters}
                      setValue={setCharacters}
                      max={5}
                    />
                    <div className="grid gap-3 sm:grid-cols-3">
                      <div className="sm:col-span-2">
                        <label className="block text-sm font-medium">Username *</label>
                        <input
                          className="mt-1 w-full rounded-md border px-3 py-2"
                          value={username}
                          readOnly                 
                          placeholder="Click 'Make a username for me'"
                        />
                        {username && isToxic(username) && <p className="text-xs text-red-600 mt-1">Please choose a different username (failed safety check).</p>}
                      </div>
                      <div className="flex items-end">
                        <button
                          type="button"
                          className="rounded-md border px-3 py-2 w-full sm:w-auto"
                          onClick={() => {
                            let candidate = "";
                            let attempts = 0;
                            do {
                              candidate = makeUsername();
                              attempts++;
                            } while (isToxic(candidate) && attempts < 5);
                            setUsername(candidate);
                          }}
                        >
                          Make a username for me
                        </button>
                      </div>
                    </div>

            
                  </section>

                  

                  {/* <label className="inline-flex items-center gap-2 mt-1">
                    <input type="checkbox" checked={agree} onChange={(e)=>setAgree(e.target.checked)} />
                    <span className="text-sm">I have read and agree to the DUA</span>
                  </label> */}

                  {err && <p className="text-sm text-red-600">{err}</p>}
                </main>

                <footer className="px-6 py-4 border-t flex justify-end gap-2">
                  <button type="button" onClick={() => setOpen(false)} className="rounded-md border px-4 py-2">Cancel</button>
                  <button
                    type="button"
                    onClick={queueAndGo }
                    className={`rounded-md px-4 py-2 text-white ${valid ? "bg-blue-600 hover:bg-blue-700" : "bg-blue-300 cursor-not-allowed"}`}
                    disabled={!valid}
                  >
                    Submit
                  </button>
                </footer>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
