'use client'
import { NextResponse } from 'next/server';
import { getCurrentDateComponents, ensureFolderExists } from '../../utils/dateUtils';
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useEffect, useState } from 'react';

import fs from 'fs';
import path from 'path';
import Papa from 'papaparse';

export default function CreateDirectoryPage() {
  const [message, setMessage] = useState('');

  const handleCreateDirectory = async () => {
    try {
      const res = await fetch('/api/utils/create-directory');
      const data = await res.json();
      setMessage(data.message + ' Chemin: ' + data.path);
    } catch (error) {
      setMessage('Erreur lors de la création du dossier');
    }
  };

  const [open, setOpen] = useState(true);

  useEffect(() => {
    setOpen(true);
  }, []);

  return (
    <>
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline">Edit Profile</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Edit profile</DialogTitle>
          <DialogDescription>
            Make changes to your profile here. Click save when you're done.
          </DialogDescription>
        </DialogHeader>
       
      </DialogContent>
    </Dialog>

    <div>
      <h1>Créer un dossier</h1>
      <button onClick={handleCreateDirectory}>Créer le dossier</button>
      {message && <p>{message}</p>}
    </div>
    </>
  );
}
