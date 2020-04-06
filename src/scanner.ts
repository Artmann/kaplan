import { promises as fs, stat } from 'fs';
import { join } from 'path';
import { useEffect, useState } from 'react';

export interface FileEntry {
  isDirectory: boolean;
  markedForDeletion: boolean;
  path: string;
  size: number;
}

export function useScanner(rootPath: string): [ FileEntry[], boolean ] {
  const [ isDone, setIsDone ] = useState(false);
  const [ files, setFiles ] = useState<FileEntry[]>([]);

  const scan = async(path: string): Promise<void> => {
    const paths = await fs.readdir(path)

    for (let i = 0; i < paths.length; i++) {
      try {
        const filePath = join(path, paths[i]);
        const stats = await fs.stat(filePath);

        if (stats.isDirectory()) {
          await scan(filePath);
        }

        const entry: FileEntry = {
          isDirectory: stats.isDirectory(),
          markedForDeletion: false,
          path: filePath,
          size: stats.size
        };

        files.push(entry);

        setFiles([...files]);
      } catch(e) {
        console.error(e);
      }
    }
  };

  useEffect(() => {
    scan(rootPath).then(() => {
      setIsDone(true);
    });

  }, [ rootPath ]);

  return [ files, isDone ];
}
