/* ระบบห้องสมุด — ตัวช่วยร่วมทุกหน้า */
function $(id) { return document.getElementById(id); }
function show(id, on) { $(id).classList.toggle('hidden', !on); }
function say(id, text, ok) { var e = $(id); e.textContent = text || ''; e.className = 'msg' + (ok ? ' ok' : ''); }
function el(tag, cls, text) { var e = document.createElement(tag); if (cls) e.className = cls; if (text != null) e.textContent = text; return e; }
function clear(node) { while (node.firstChild) node.removeChild(node.firstChild); }
function debounce(f, ms) { var t; return function () { var a = arguments; clearTimeout(t); t = setTimeout(function () { f.apply(null, a); }, ms); }; }

/**
 * เรียกฟังก์ชันหลังบ้าน (Apps Script): run('ชื่อฟังก์ชัน', [args], ทำเมื่อสำเร็จ, ทำเมื่อผิดพลาด(ข้อความ))
 * - ส่งแบบ text/plain เพื่อไม่ต้องผ่านขั้นตรวจ CORS เพิ่ม
 * - credentials: 'omit' = ไม่แนบบัญชี Google ของเบราว์เซอร์ไปด้วย (ต้นเหตุของปัญหาเปิดไม่ได้เมื่อล็อกอินหลายบัญชี)
 */
function run(fn, args, ok, fail) {
  var url = window.LIB_CONFIG && window.LIB_CONFIG.apiUrl;
  if (!url) { fail('ยังไม่ได้ตั้งค่า apiUrl ใน config.js'); return; }
  fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'text/plain;charset=utf-8' },
    body: JSON.stringify({ fn: fn, args: args || [] }),
    credentials: 'omit',
    redirect: 'follow',
    cache: 'no-store'
  }).then(function (r) {
    if (!r.ok) throw new Error('HTTP ' + r.status);
    return r.json();
  }).then(function (d) {
    if (d && d.ok) ok(d.val); else fail((d && d.err) || 'เกิดข้อผิดพลาด');
  }).catch(function (e) {
    fail('เชื่อมต่อระบบไม่ได้ กรุณาลองใหม่ (' + ((e && e.message) || e) + ')');
  });
}

/** PIN อยู่ในหน่วยความจำของหน้านี้เท่านั้น ปิดหรือรีเฟรชหน้าแล้วต้องใส่ใหม่ */
var PIN = '';
function setupLogin(role, onReady) {
  function go() {
    var p = $('pin').value;
    if (!p) { say('pinMsg', 'กรุณาใส่ PIN'); return; }
    $('pinBtn').disabled = true;
    say('pinMsg', 'กำลังตรวจสอบ...', true);
    run('login', [role, p], function () {
      PIN = p; $('pin').value = ''; show('pinCard', false); onReady();
    }, function (m) { say('pinMsg', m); $('pinBtn').disabled = false; });
  }
  $('pinBtn').onclick = go;
  $('pin').addEventListener('keydown', function (e) { if (e.key === 'Enter') go(); });
  $('pin').focus();
}

/** กล่องยืนยันแบบฝังในรายการ (แทน prompt) — needText: ต้องกรอกเหตุผล */
function inlineConfirm(host, opts) {
  var box = el('div', 'copy');
  if (opts.options && opts.options.length) {
    var sel = el('select');
    opts.options.forEach(function (o) { var op = el('option', null, o); op.value = o; sel.appendChild(op); });
    box.appendChild(sel);
  }
  var inp = null;
  if (opts.placeholder) {
    inp = el('input'); inp.type = 'text'; inp.maxLength = 200; inp.placeholder = opts.placeholder;
    inp.style.marginTop = '6px'; box.appendChild(inp);
  }
  var acts = el('div', 'actions');
  var yes = el('button', 'small ' + (opts.danger ? 'danger' : ''), opts.label || 'ยืนยัน');
  var no = el('button', 'small ghost', 'ยกเลิก');
  var m = el('div', 'msg');
  acts.appendChild(yes); acts.appendChild(no);
  box.appendChild(acts); box.appendChild(m);
  host.appendChild(box);
  no.onclick = function () { host.removeChild(box); };
  yes.onclick = function () {
    var parts = [];
    if (sel && sel.value) parts.push(sel.value);
    if (inp && inp.value.trim()) parts.push(inp.value.trim());
    var text = parts.join(' — ');
    if (opts.required && !text) { m.textContent = 'กรุณาระบุเหตุผล'; return; }
    yes.disabled = true; m.className = 'msg ok'; m.textContent = 'กำลังบันทึก...';
    opts.onConfirm(text, function (err) { yes.disabled = false; m.className = 'msg'; m.textContent = err; });
  };
}
