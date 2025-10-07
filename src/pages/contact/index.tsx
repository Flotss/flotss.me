'use client';
import { Container } from '@/components/StyledBox';
import { EmailInputs } from '@/services/EmailService';
import { owner } from '@/services/GithubService';
import { Repo } from '@/types/types';
import { loadGithubInformation } from '@/utils/RepoUtils';
import { Box, Heading, Text, useToast } from '@chakra-ui/react';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import ContactHeader from './component/ContactHeader';
import FormSendEmail from './component/FormSendEmail';
import GithubInfo from './component/GithubInfo';

export default function Contact(props: any) {
  const toast = useToast();

  const [isLoading, setLoading] = useState<boolean>(true);

  // Get Inforamtion of the user github
  const [user, setUser] = useState<any>(null);
  const [repos, setRepos] = useState<Repo[]>([]);

  // FORM
  const [subject, setSubject] = useState<string>('');
  const [email, setEmail] = useState<string>('');
  const [message, setMessage] = useState<string>('');

  useEffect(() => {
    loadGithubInformation({
      owner: owner,
      setUser: setUser,
      setRepos: setRepos,
      toast: toast,
      setLoading: setLoading,
    });
  }, [toast]);

  const getStargazerCount = () => {
    return repos.reduce((a, b) => a + b.stargazers_count, 0);
  };

  const getWatchersCount = () => {
    return repos.reduce((a, b) => a + b.watchers_count, 0);
  };

  // Form handler
  const emailRequired = 'Email is required.';
  const emailPattern = 'Email is not valid, please enter a valid email like exemple@dom.com';

  const [subjectError, setSubjectError] = useState<boolean>(false);

  const [emailError, setEmailError] = useState<boolean>(false);
  const [emailHelperMessage, setEmailHelperMessage] = useState<string>(emailRequired);

  const [messageError, setMessageError] = useState<boolean>(false);
  const [isSending, setIsSending] = useState<boolean>(false);
  const [successFullySend, setSuccessFullySend] = useState<boolean>(false);
  const [errorSend, setErrorSend] = useState<boolean>(false);

  const isErrors = () => {
    if (subject.length === 0) {
      return true;
    }

    if (emailIsError()) {
      return true;
    }

    if (message.length === 0) {
      return true;
    }
    return false;
  };

  const emailIsError = () => {
    if (email.length === 0) {
      setEmailHelperMessage(emailRequired);
      return true;
    } else if (!email.match('^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,6}$')) {
      setEmailHelperMessage(emailPattern);
      return true;
    }
    return false;
  };

  const setErrors = () => {
    if (subject.length === 0) {
      setSubjectError(true);
    }

    if (emailIsError()) {
      setEmailError(true);
    }

    if (message.length === 0) {
      setMessageError(true);
    }
  };

  const handlerInput = (setFieldError: (arg0: boolean) => void, input: string | any[]) => {
    if (input.length == 0) {
      setFieldError(true);
    } else {
      setFieldError(false);
    }
  };

  const sendEmail = () => {
    if (isErrors() || isSending || successFullySend) {
      return;
    }
    setIsSending(true);
    // Send email
    fetch('/api/send/email', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email,
        subject,
        message,
      } as EmailInputs),
    })
      .then(async (response) => {
        setIsSending(false);
        if (response.ok) {
          toast({
            title: 'Email sent.',
            description: 'Your email has been sent.',
            status: 'success',
            duration: 3000,
            isClosable: true,
          });
          setSuccessFullySend(true);
          setSubject('');
          setEmail('');
          setMessage('');

          setTimeout(() => {
            setSuccessFullySend(false);
          }, 3000);
        } else {
          const responseData = await response.json();
          const responseString = responseData.message || 'Unknown error occurred';
          toast({
            title: 'Error.',
            description: `${responseString}`,
            status: 'error',
            duration: 3000,
            isClosable: true,
          });
          setErrorSend(true);
          setTimeout(() => {
            setErrorSend(false);
          }, 3000);
        }
      })
      .catch((error) => {
        setIsSending(false);
        toast({
          title: 'Error.',
          description: error.message || 'Unknown error occurred',
          status: 'error',
          duration: 3000,
          isClosable: true,
        });
        setErrorSend(true);
        setTimeout(() => {
          setErrorSend(false);
        }, 3000);
      });
  };

  return (
    <>
      <div className="flex flex-col gap-5 px-5 py-5 sm:px-20">
        <ContactHeader></ContactHeader>
        {/* Form to send an email to me */}
        <Box className="grid grid-cols-1 gap-5 lg:grid-cols-2">
          <Container>
            <Box className="flex flex-col gap-2">
              <Heading size="md" className="text-white">
                Contact Me
              </Heading>
              <Text className="inline text-white">
                If you have any questions or would like to work together, I would love to hear from
                you. You can reach me directly via email at:&nbsp;
                <Link href="mailto:manginf54@gmail.com" className="hover:underline">
                  <Text as="span" fontWeight={700}>
                    manginf54@gmail.com
                  </Text>
                </Link>
              </Text>
              <Box className="flex flex-col gap-2">
                <FormSendEmail
                  email={email}
                  setEmail={setEmail}
                  emailError={emailError}
                  setEmailError={setEmailError}
                  emailHelperMessage={emailHelperMessage}
                  emailIsError={emailIsError}
                  subject={subject}
                  setSubject={setSubject}
                  subjectError={subjectError}
                  setSubjectError={setSubjectError}
                  message={message}
                  setMessage={setMessage}
                  messageError={messageError}
                  setMessageError={setMessageError}
                  setErrors={setErrors}
                  isSending={isSending}
                  successFullySend={successFullySend}
                  errorSend={errorSend}
                  handlerInput={handlerInput}
                  sendEmail={sendEmail}
                ></FormSendEmail>
              </Box>
            </Box>
          </Container>
          <Container className="p-4 py-8 lg:p-8">
            <Heading size="md" className="pb-5 text-white lg:pb-10">
              About Me
            </Heading>
            <Box className="flex flex-row flex-wrap justify-around gap-2">
              {/* Github CARD */}
              {isLoading ? (
                <Text className="text-white">Loading...</Text>
              ) : (
                <GithubInfo
                  user={user.user}
                  repos={repos}
                  getStargazerCount={getStargazerCount}
                  getWatchersCount={getWatchersCount}
                />
              )}
            </Box>
          </Container>
        </Box>
      </div>
    </>
  );
}
