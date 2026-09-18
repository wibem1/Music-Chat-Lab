(()=>{
'use strict';
if(window.MCLCompositionIntent)return;
const NEW_RE=/\b(neu(?:e|en|er|es)?|neukomposition|eigenständig(?:e|en|er|es)?|von grund auf)\b/i;
const EDIT_RE=/\b(variation|variiere|bearbeite|überarbeite|ändere|aendere|ersetze|repariere|verbessere|erweitere|kürze|kuerze|patch|merge|fassung von|auf grundlage (?:von|des)|speicher\s*[1-6])\b/i;
const EDIT_ACTION_RE=/\b(variation|variiere|bearbeite|überarbeite|ändere|aendere|ersetze|repariere|verbessere|erweitere|kürze|kuerze|patch|merge|ergänze|ergaenze|füge|fuege|kombiniere|verbinde|mische|orchestriere|harmonisiere|begleite)\b/i;
const SOURCE_REF_RE=/\b(speicher\s*[1-6]|dies(?:e|er|es|en)\s+(?:stück|stueck|fassung|datei|komposition|midi)|vorhanden(?:e|en|er|es)\s+(?:stück|stueck|fassung|datei|komposition|material)|ausgangsmaterial|vorlage|original)\b/i;
function hasCurrentSource(message){return !!(message?.files||[]).some(f=>['midi','musicxml','clab'].includes(String(f?.kind||'').toLowerCase()))||/<MCL_SCORE\b|\[MCL-(?:ENGINE14|CLAB)-SCORE\b/i.test(String(message?.text||''));}
function wantsExistingMaterial({text='',message=null}={}){const s=String(text||'').trim();return hasCurrentSource(message)||SOURCE_REF_RE.test(s)||(EDIT_ACTION_RE.test(s)&&/\b(?:davon|daraus|hieraus|darüber|darueber|dazu)\b/i.test(s));}
function requiresNew({text='',message=null}={}){const s=String(text||'').trim();return !!s&&!hasCurrentSource(message)&&NEW_RE.test(s)&&!EDIT_RE.test(s)}
function freshCompose({text='',message=null}={}){const s=String(text||'').trim();return !!s&&!wantsExistingMaterial({text:s,message});}
function accepts(action,forceNew){if(!forceNew)return true;return String(action?.type||'').toLowerCase()==='new_score'&&!Object.prototype.hasOwnProperty.call(action||{},'baseSlot')}
window.MCLCompositionIntent={version:'2.0.2',requiresNew,freshCompose,wantsExistingMaterial,accepts,hasCurrentSource};
})();