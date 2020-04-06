import { Text, Box } from 'ink';
import prettyBytes from 'pretty-bytes';
import React from 'react';

import { FileEntry } from './scanner';

interface ScanProgressProps {
  files: FileEntry[];
	path: string;
}

export default function ScanProgress({ files, path }: ScanProgressProps) {
	const totalSize = files.map(file => file.size).reduce((a, b) => a + b, 0);

	return (
		<Box flexDirection="column" paddingX={6} paddingY={4}>
			<Box flexDirection="column" marginBottom={2}>
				<Text>
					Scanning: { path }.
				</Text>
				<Text>
					Total size: { prettyBytes(totalSize) }.
				</Text>
				<Text>
					Number of files: { files.length }.
				</Text>
			</Box>
			<Box>
				<Text>
					{ files.length > 0 ? files[files.length - 1].path : 'Scanning...' }
				</Text>
			</Box>
		</Box>
	);
}
