// สร้างจากไฟล์สไลด์บทเรียน (Chapter01-03) — ใช้แสดงสารบัญสไลด์ในแท็บ "สไลด์"
const SLIDE_CHAPTERS = [
  {
    "id": "ch1",
    "label": "บทที่ 1",
    "title": "เลขฐานและระบบจำนวน",
    "subtitle": "Digital Systems · Binary Numbers",
    "count": 21,
    "slides": [
      {
        "n": 1,
        "t": "สไลด์ที่ 1"
      },
      {
        "n": 2,
        "t": "Binary Numbers"
      },
      {
        "n": 3,
        "t": "สไลด์ที่ 3"
      },
      {
        "n": 4,
        "t": "Note that 230 = 1,073,741,824 (1G)"
      },
      {
        "n": 5,
        "t": "Number-base Conversions"
      },
      {
        "n": 6,
        "t": "Number-base Conversions"
      },
      {
        "n": 7,
        "t": "ส่วนที่เป็นจํานวนเต็ม"
      },
      {
        "n": 8,
        "t": "ส่วนที่เป็นทศนิยม"
      },
      {
        "n": 9,
        "t": "Octal and Hexadecimal Numbers"
      },
      {
        "n": 10,
        "t": "แปลงฐาน 2 เป็นฐาน 8"
      },
      {
        "n": 11,
        "t": "แปลงฐาน 2 เป็นฐาน 16"
      },
      {
        "n": 12,
        "t": "Complements of Numbers"
      },
      {
        "n": 13,
        "t": "Radix Complement"
      },
      {
        "n": 14,
        "t": "Subtraction with Complements"
      },
      {
        "n": 15,
        "t": "สไลด์ที่ 15"
      },
      {
        "n": 16,
        "t": "สไลด์ที่ 16"
      },
      {
        "n": 17,
        "t": "สไลด์ที่ 17"
      },
      {
        "n": 18,
        "t": "Signed Binary Numbers"
      },
      {
        "n": 19,
        "t": "ข้อเสีย"
      },
      {
        "n": 20,
        "t": "ในระบบ 2’s complement บวกกันได้ตรงๆ เลย ไม่ว่าจะเป็นเลขบวกหรือลบ"
      },
      {
        "n": 21,
        "t": "ใช้วงจรบวก"
      }
    ]
  },
  {
    "id": "ch2",
    "label": "บทที่ 2",
    "title": "ลอจิกเกตและพีชคณิตบูลีน",
    "subtitle": "Basic Logic Gates",
    "count": 55,
    "slides": [
      {
        "n": 1,
        "t": "Basic Logic Gates"
      },
      {
        "n": 2,
        "t": "Logic Gate"
      },
      {
        "n": 3,
        "t": "Logic Gate (ต่อ)"
      },
      {
        "n": 4,
        "t": "• วงจร Logic เบื้องต้นจะเป็น Two-state Logic คือ ค่าของ"
      },
      {
        "n": 5,
        "t": "• ในระบบ Electronic Logic เราใช้ระดับของแรงดันไฟฟ้า"
      },
      {
        "n": 6,
        "t": "• ตารางความจริง เป็นตารางที่บอกถึงฟังก์ชันเอาต์พุตของ"
      },
      {
        "n": 7,
        "t": "พีชคณิตบูลีน (Boolean Algebra)"
      },
      {
        "n": 8,
        "t": "Basic Logic Gates"
      },
      {
        "n": 9,
        "t": "NOT Gate -- Inverter"
      },
      {
        "n": 10,
        "t": "• Y = ~X"
      },
      {
        "n": 11,
        "t": "NOT"
      },
      {
        "n": 12,
        "t": "AND Gate"
      },
      {
        "n": 13,
        "t": "• X & Y"
      },
      {
        "n": 14,
        "t": "OR Gate"
      },
      {
        "n": 15,
        "t": "• X | Y"
      },
      {
        "n": 16,
        "t": "Basic Logic Gates"
      },
      {
        "n": 17,
        "t": "NAND Gate"
      },
      {
        "n": 18,
        "t": "NAND Gate"
      },
      {
        "n": 19,
        "t": "NOR Gate"
      },
      {
        "n": 20,
        "t": "NOR Gate"
      },
      {
        "n": 21,
        "t": "Basic Logic Gates"
      },
      {
        "n": 22,
        "t": "NAND Gate"
      },
      {
        "n": 23,
        "t": "De Morgan’s Theorem-1"
      },
      {
        "n": 24,
        "t": "NOR Gate"
      },
      {
        "n": 25,
        "t": "De Morgan’s Theorem-2"
      },
      {
        "n": 26,
        "t": "De Morgan’s Theorem"
      },
      {
        "n": 27,
        "t": "Basic Logic Gates"
      },
      {
        "n": 28,
        "t": "Exclusive-OR Gate"
      },
      {
        "n": 29,
        "t": "XOR"
      },
      {
        "n": 30,
        "t": "Exclusive-NOR Gate"
      },
      {
        "n": 31,
        "t": "XNOR"
      },
      {
        "n": 32,
        "t": "Basic Logic Gates"
      },
      {
        "n": 33,
        "t": "Multiple-input Gates"
      },
      {
        "n": 34,
        "t": "Multiple-input AND Gate"
      },
      {
        "n": 35,
        "t": "Multiple-input OR Gate"
      },
      {
        "n": 36,
        "t": "Multiple-input NAND Gate"
      },
      {
        "n": 37,
        "t": "Multiple-input NOR Gate"
      },
      {
        "n": 38,
        "t": "กฏของพีชคณิตบูลีน"
      },
      {
        "n": 39,
        "t": "กฏของพีชคณิตบูลีน"
      },
      {
        "n": 40,
        "t": "ตัวอย่าง"
      },
      {
        "n": 41,
        "t": "ตัวอย่าง"
      },
      {
        "n": 42,
        "t": "SOP and POS"
      },
      {
        "n": 43,
        "t": "Canonical Sum"
      },
      {
        "n": 44,
        "t": "Canonical Sum (ต่อ)"
      },
      {
        "n": 45,
        "t": "SOP and POS (ต่อ)"
      },
      {
        "n": 46,
        "t": "Canonical Product"
      },
      {
        "n": 47,
        "t": "Canonical Product"
      },
      {
        "n": 48,
        "t": "SOP<->POS"
      },
      {
        "n": 49,
        "t": "Minterm <-> Maxterm"
      },
      {
        "n": 50,
        "t": "Minterm <-> Maxterm (ต่อ)"
      },
      {
        "n": 51,
        "t": "Minterm <-> Maxterm (ต่อ)"
      },
      {
        "n": 52,
        "t": "Exercise (ลดทอนสมการ, Maxterm/Minterm)"
      },
      {
        "n": 53,
        "t": "Exercise"
      },
      {
        "n": 54,
        "t": "Timing Diagram"
      },
      {
        "n": 55,
        "t": "Exercise"
      }
    ]
  },
  {
    "id": "ch3",
    "label": "บทที่ 3",
    "title": "แผนผังคาร์โนห์ (K-map)",
    "subtitle": "Karnaugh Map",
    "count": 43,
    "slides": [
      {
        "n": 1,
        "t": "แผนผังคาร์โนห์ (Karnaugh Map : KM : K-map)"
      },
      {
        "n": 2,
        "t": "สไลด์ที่ 2"
      },
      {
        "n": 3,
        "t": "สไลด์ที่ 3"
      },
      {
        "n": 4,
        "t": "สไลด์ที่ 4"
      },
      {
        "n": 5,
        "t": "สไลด์ที่ 5"
      },
      {
        "n": 6,
        "t": "สไลด์ที่ 6"
      },
      {
        "n": 7,
        "t": "สไลด์ที่ 7"
      },
      {
        "n": 8,
        "t": "สไลด์ที่ 8"
      },
      {
        "n": 9,
        "t": "สไลด์ที่ 9"
      },
      {
        "n": 10,
        "t": "สไลด์ที่ 10"
      },
      {
        "n": 11,
        "t": "สไลด์ที่ 11"
      },
      {
        "n": 12,
        "t": "สไลด์ที่ 12"
      },
      {
        "n": 13,
        "t": "สไลด์ที่ 13"
      },
      {
        "n": 14,
        "t": "สไลด์ที่ 14"
      },
      {
        "n": 15,
        "t": "สไลด์ที่ 15"
      },
      {
        "n": 16,
        "t": "สไลด์ที่ 16"
      },
      {
        "n": 17,
        "t": "สไลด์ที่ 17"
      },
      {
        "n": 18,
        "t": "สไลด์ที่ 18"
      },
      {
        "n": 19,
        "t": "สไลด์ที่ 19"
      },
      {
        "n": 20,
        "t": "สไลด์ที่ 20"
      },
      {
        "n": 21,
        "t": "สไลด์ที่ 21"
      },
      {
        "n": 22,
        "t": "v116d1\u0011n 8.6 f(A, B C"
      },
      {
        "n": 23,
        "t": "สไลด์ที่ 23"
      },
      {
        "n": 24,
        "t": "vlJ0al-'lTI 8.8 f(A.,B:;C:;D) = Em ( 0, 2, 4, 5, 6, 7, 8, 10, 12, 14)"
      },
      {
        "n": 25,
        "t": "สไลด์ที่ 25"
      },
      {
        "n": 26,
        "t": "สไลด์ที่ 26"
      },
      {
        "n": 27,
        "t": "สไลด์ที่ 27"
      },
      {
        "n": 28,
        "t": "สไลด์ที่ 28"
      },
      {
        "n": 29,
        "t": "สไลด์ที่ 29"
      },
      {
        "n": 30,
        "t": "สไลด์ที่ 30"
      },
      {
        "n": 31,
        "t": "สไลด์ที่ 31"
      },
      {
        "n": 32,
        "t": "สไลด์ที่ 32"
      },
      {
        "n": 33,
        "t": "สไลด์ที่ 33"
      },
      {
        "n": 34,
        "t": "สไลด์ที่ 34"
      },
      {
        "n": 35,
        "t": "สไลด์ที่ 35"
      },
      {
        "n": 36,
        "t": "สไลด์ที่ 36"
      },
      {
        "n": 37,
        "t": "สไลด์ที่ 37"
      },
      {
        "n": 38,
        "t": "สไลด์ที่ 38"
      },
      {
        "n": 39,
        "t": "สไลด์ที่ 39"
      },
      {
        "n": 40,
        "t": "สไลด์ที่ 40"
      },
      {
        "n": 41,
        "t": "สไลด์ที่ 41"
      },
      {
        "n": 42,
        "t": "สไลด์ที่ 42"
      },
      {
        "n": 43,
        "t": "สไลด์ที่ 43"
      }
    ]
  }
];
