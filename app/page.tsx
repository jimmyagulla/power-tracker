"use client"

import React, { useCallback, useEffect, useState } from 'react';

const sheetId = '1fun6b2rEC_T3Gc_WmKFw1E9jHT033DTpujxn1UNt5zI';

type Nullable<T> = T | null;

type SheetTableColumn = {
  id: number;
  label: string;
  type: string;
  pattern: string;
};

type SheetTableCell = {
  v?: string | number | null;
  f?: string;
} | null;

type SheetTableRow = {
  c: SheetTableCell[];
};

type SheetTable = {
  cols: SheetTableColumn[];
  parsedNumHeaders: number;
  rows: SheetTableRow[];
};

type SheetData = {
  reqId: string;
  sig: string;
  status: string;
  table: SheetTable;
  version: string;
};

type Exercise = {
  name: string;
  protocol: string;
  indications: string; 
};

type Session = {
  title: string;
  exercises: Exercise[];
};

interface Block {
  title: string;
  sessions: Session[];
  weekNumber: number;
};

interface ParsedSheetData {
  blocks: Block[];
};

export default function Home() {
  const [data, setData] = useState<Nullable<ParsedSheetData[]>>(null);

  const getExercise = useCallback(
    (rows: SheetTableRow[], sessionIndex: number, exerciseIndex: number): Exercise => {
      const name = String(rows[sessionIndex + 1].c[exerciseIndex]?.v);
      const exerciseInformation = String(rows[sessionIndex + 3].c[exerciseIndex]?.v);
      const protocol = exerciseInformation?.split('\n\n')[0];
      const indications = exerciseInformation?.split('\n\n')[1];

      return {
        name,
        protocol,
        indications,
      };
    },
  []);

  const getFullSession = useCallback(
    (rows: SheetTableRow[], sessionIndex: number, cellIndex: number) => {
      const session: Session = {
        title: String(rows[sessionIndex].c[cellIndex]?.v),
        exercises: [],
      };

      const row: SheetTableRow = rows[sessionIndex + 1];

      for (let j = 0; j < row.c.length; j++) {
        if (typeof row.c[j]?.v !== 'string') continue;

        const cellName = String(row.c[j]?.v);

        if (cellName) {
          if (cellName.startsWith('Session') || cellName.startsWith('Slot')) {
            return session;
          }

          // console.log('pushing exercise for session: ', session.title, '\n\n on cell: ', cellName);
          session.exercises.push(getExercise(rows, sessionIndex, j));
        }
      }

      return session;
    },
  [])

  const parseSheetData = useCallback((sheetData: SheetData) => {
    if (!sheetData) return;

    const rows = sheetData.table.rows;

    rows.forEach((row: SheetTableRow, rowIndex: number) => {
      row.c.forEach((cell: SheetTableCell, cellIndex) => {
        if (cell?.v && typeof cell.v === 'string' && cell.v.startsWith('Session')) {
          // console.log('getting full session for: ', cell.v);
          const session = getFullSession(rows, rowIndex, cellIndex);
          console.log('session: ', session);
          return;
        }
      })
    })
  }, []);

  useEffect(() => {
    const init = async () => {
      const res = await fetch(`/api/sheets?sheetId=${sheetId}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json'
        },
      });
      
      const json = await res.json();
      const sheetData = JSON.parse(json.substring(47).slice(0, -2));
      console.log(sheetData)
      parseSheetData(sheetData);
    };
  
    init();
  }, [])

  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <h1>Sheets API Quickstart</h1>
    </main>
  );
};
