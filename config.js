/*
 * ตั้งค่าระบบห้องสมุด — ไฟล์เดียวที่ต้องแก้เมื่อลิงก์เปลี่ยน
 * ห้ามใส่ PIN, token หรือข้อมูลลับใด ๆ ในไฟล์นี้ (ทุกคนเปิดดูได้)
 */
window.LIB_CONFIG = {
  // ลิงก์ Web app ของ Apps Script (ลงท้าย /exec) — หน้าเว็บส่งคำสั่งไปที่นี่
  apiUrl: 'https://script.google.com/macros/s/AKfycbzHN1Q8uSuUFMohCXxQ9BKLJ39PRgOFmzBz83cm3iMCw-qKhaykgsp_YeLoweXbcx4b/exec',

  // (ไม่บังคับ) ลิงก์ Google Sheets ให้แสดงในหน้ารวมลิงก์ — เว้นว่างไว้ได้
  sheetUrl: ''
};
