import { Text, Box, useInput } from 'ink';
import { basename, join, sep } from 'path';
import React, { useState } from 'react';

import { useScanner, FileEntry } from './scanner';
import ScanProgress from './scan-progress';

export interface AppProps {
	isSandboxed: boolean;
	path: string;
}

interface FileBrowserProps {
	files: FileEntry[];
	rootPath: string;
}

function depth(path: string): number {
	return path.split(sep).length;
}

function FileBrowser({ files, rootPath }: FileBrowserProps) {
	const [ currentPath, setCurrentPath ] = useState(rootPath);
	const [ index, setIndex ] = useState(0);

	const filesInPath = files
		.filter(f => f.path.startsWith(currentPath))
		.filter(f => depth(f.path) === depth(currentPath) + 1)
		.sort((a, b) => a.path > b.path ? 1 : -1);

	const enterDirectory = (file: FileEntry) => {
		if (file.isDirectory) {
			setCurrentPath(file.path);
		}
	};
	const leaveDirectory = () => {
		if (depth(currentPath) === depth(rootPath)) {
			return;
		}

		setCurrentPath(currentPath.split(sep).slice(0, -1).join(sep));
	}

	useInput((input, key) => {
		if (key.downArrow) {
			setIndex(Math.min(index + 1, filesInPath.length - 1));
		}
		if (key.upArrow) {
			setIndex(Math.max(index - 1, 0));
		}
		if (key.rightArrow || key.return) {
			enterDirectory(filesInPath[index]);
		}
		if (key.leftArrow) {
			leaveDirectory();
		}
	});

	return (
		<Box flexDirection="column">
			<Text>
				{ currentPath }
			</Text>
			{
				filesInPath.map((file, i) => (
					<Box>
						<Text key={file.path} bold={ index === i }>
							{ basename(file.path) }
						</Text>
					</Box>
				))
			}
		</Box>
	);
}

export default function App({ path }: AppProps) {
	const [ files, isDone ] = useScanner(path);

	if (!isDone) {
		return (
			<ScanProgress files={ files } path={ path } />
		);
	}

	return (
		<FileBrowser files={ files } rootPath={ path } />
	);
}
