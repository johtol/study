import {
  Center, Flex, Loader, Space, Text,
} from '@mantine/core';
import { useEffect, useState } from 'react';
import { useStudyConfig } from '../store/hooks/useStudyConfig';
import ReactMarkdownWrapper from './ReactMarkdownWrapper';
import { useDisableBrowserBack } from '../utils/useDisableBrowserBack';
import { useStorageEngine } from '../store/storageEngineHooks';
import { useStoreSelector } from '../store/store';

export function StudyEnd() {
  const config = useStudyConfig();
  const { storageEngine } = useStorageEngine();
  const { answers } = useStoreSelector((state) => state);

  const [completed, setCompleted] = useState(false);
  useEffect(() => {
    // verify that storageEngine.verifyCompletion() returns true, loop until it does
    const interval = setInterval(async () => {
      const isComplete = await storageEngine!.verifyCompletion(answers);
      if (isComplete) {
        setCompleted(true);
        clearInterval(interval);
      }
    }, 1000);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Disable browser back button on study end
  useDisableBrowserBack();

  return (
    <Center style={{ height: '100%' }}>
      <Flex direction="column">
        {completed
          ? (
            <Text size="xl" display="block">
              {config.uiConfig.studyEndMsg
                ? <ReactMarkdownWrapper text={config.uiConfig.studyEndMsg} />
                : 'Thank you for completing the study. You may close this window now.'}
            </Text>
          )
          : (
            <>
              <Text size="xl" display="block">Please wait while your answers are uploaded.</Text>
              <Space h="lg" />
              <Center>
                <Loader color="blue" />
              </Center>
            </>
          )}
      </Flex>
    </Center>
  );
}
