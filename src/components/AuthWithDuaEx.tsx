// AuthWithDua.tsx
import { useState } from "react";
import { useAuthenticator, Button } from "@aws-amplify/ui-react";

function DUAModal({ open, onAgree, onCancel }: { open:boolean; onAgree:()=>void; onCancel:()=>void }) {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="w-full max-w-2xl rounded-xl bg-white p-6 shadow-xl">
        <h2 className="text-xl font-semibold mb-3">Data Use Agreement</h2>
        <div className="h-64 overflow-y-auto border rounded-md p-3 mb-4 text-sm">
          {/* your DUA text */}
          <p>
 Interim Data Use Agreement 
This Interim Data Use Agreement (DUA) establishes the terms and conditions for accessing, viewing, and using Sesame Street Archive images and data. 
	1.	Users of the Sesame Street Archive  data shall comply with all applicable Federal and State laws and regulations governing the confidentiality of the information that is the subject of this Agreement. 
	2.	Data described in this agreement shall only be used for purposes of research, analysis, and publication related to the Sesame Street Archive. 
	3.	Data users will not release the Sesame Street Archive images or data to a third party without prior express written approval from the Principal Investigator of the Sesame Street Archive.
	4.	This Agreement is not assignable, whether by operation of law or otherwise, without the prior written consent. 
	5.	The Agreement shall be interpreted in accordance with the laws of the State of Tennessee. 
	6.	No data user shall have authority to make any statements, representations, or commitments of any kind on behalf of the Sesame Street Archive, or to take any action which shall be binding on the Sesame Street Archive project. 
	7.	Any third party granted access to data, as permitted under condition #3, above, shall be subject to the terms and conditions of this agreement. Acceptance of these terms must be provided in writing by the third party before data will be released. 
	8.	To the extent any data user has reason to believe that the data have been compromised, that individual shall notify the Principal Investigator of the Sesame Street Archive  without undue delay. 
	9.	Data users should report to the Sesame Street Archive Principal Investigator any departures from this agreement. 

Failure to do so in a timely manner could result in suspended access to the data. 
This Interim Data Use Agreement expires one year from the signature date below and will need to be renewed in order for data access privileges to be maintained. 
<p>Clicking the button below indicates that you understand and agree to abide by the terms and conditions of this Interim Data Use Agreement. 
</p>

</p>
        </div>
        <div className="flex justify-end gap-2">
          <button onClick={onCancel} className="rounded-md border px-4 py-2">Cancel</button>
          <button onClick={onAgree} className="rounded-md bg-blue-600 text-white px-4 py-2">I Agree</button>
        </div>
      </div>
    </div>
  );
}

export default function AuthWithDua({ onAgreed }: { onAgreed: () => void }) {
  const [showDua, setShowDua] = useState(false);
  const { toSignUp } = useAuthenticator();

  return (
    <>
      <Button onClick={() => setShowDua(true)}>Create account</Button>
      <DUAModal
        open={showDua}
        onCancel={() => setShowDua(false)}
        onAgree={() => {
          setShowDua(false);
          onAgreed();   // tell parent: DUA accepted
          toSignUp();   // switch same Authenticator to Sign Up
        }}
      />
    </>
  );
}
