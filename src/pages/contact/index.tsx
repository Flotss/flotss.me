'use client';
import { StyledBox } from '@/components/StyledBox';
import Title from '@/components/Title';
import { EmailInputs } from '@/services/EmailService';
import { owner } from '@/services/GithubService';
import { Repo } from '@/types/types';
import { breakpoints } from '@/utils/tailwindBreakpoints';
import { CheckCircleIcon } from '@chakra-ui/icons';
import {
  Box,
  Button,
  Flex,
  FormControl,
  FormErrorMessage,
  FormLabel,
  Heading,
  Input,
  SlideFade,
  Spinner,
  Tag,
  TagLabel,
  Text,
  Textarea,
  useMediaQuery,
  useToast,
} from '@chakra-ui/react';
import { CrossCircledIcon } from '@radix-ui/react-icons';
import Image from 'next/image';
import Link from 'next/link';
import Script from 'next/script';
import { useEffect, useState } from 'react';

// eslint-disable-next-line no-unused-vars
export default function Contact() {
  const toast = useToast();

  // Get Inforamtion of the user github
  const [user, setUser] = useState<any>(null);
  const [repos, setRepos] = useState<Repo[]>([]);

  // FORM
  const [subject, setSubject] = useState<string>('');
  const [email, setEmail] = useState<string>('');
  const [message, setMessage] = useState<string>('');

  const [isMobile] = useMediaQuery(`(max-width:${breakpoints.lg})`);

  useEffect(() => {
    // LocalStorage
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    } else {
      fetch(`/api/get/user?name=${owner}`)
        .then((response) => response.json())
        .then((data) => {
          setUser(data);
          localStorage.setItem('user', JSON.stringify(data));
        });
    }

    const cachedRepos = localStorage.getItem('repos');
    if (cachedRepos) {
      const parsedRepos = JSON.parse(cachedRepos).repos as Repo[];
      setRepos(parsedRepos);
    }
  }, []);

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

  const handlerInput = (
    setField: (arg0: any) => void,
    setFieldError: (arg0: boolean) => void,
    input: string | any[],
  ) => {
    if (input.length === 0) {
      setFieldError(true);
    } else {
      setFieldError(false);
    }
    setField(input);
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
        console.log(response);
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
          console.log(responseData);
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
      <div className="flex flex-col gap-2 px-5 py-2 sm:px-20">
        <StyledBox className="grid grid-cols-1 gap-2 sm:grid-cols-3">
          <Box className="col-span-2">
            <Box className="flex justify-start">
              <Title title="Contact." className=""></Title>
            </Box>
            <Text>
              Like my work? Want to collaborate or just have a chat? Feel free to get in touch.
            </Text>
          </Box>
          <picture>
            <img src="/images/contactflatdesign.png" alt="contact" width={150} />
          </picture>
        </StyledBox>
        {/* Form to send an email to me */}
        <Box className="grid grid-cols-1 gap-2 lg:grid-cols-2">
          <StyledBox>
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
                <FormControl isInvalid={emailError} isRequired>
                  <SlideFade offsetY="20px" in={email.length > 0}>
                    <FormLabel htmlFor="email" className="text-white">
                      Email
                    </FormLabel>
                  </SlideFade>
                  <Input
                    type="email"
                    id="email"
                    name="email"
                    className="rounded-md bg-gray-900 p-2 text-white"
                    placeholder="Email*"
                    value={email}
                    onChange={(e) => {
                      handlerInput(setEmail, setEmailError, e.target.value);
                      setEmailError(emailIsError());
                    }}
                  />
                  <FormErrorMessage>{emailHelperMessage}</FormErrorMessage>
                </FormControl>
                <FormControl isInvalid={subjectError} isRequired>
                  <SlideFade offsetY="20px" in={subject.length > 0}>
                    <FormLabel htmlFor="Subject" className="text-white">
                      Subject
                    </FormLabel>
                  </SlideFade>
                  <Input
                    type="text"
                    id="name"
                    name="subject"
                    className="rounded-md bg-gray-900 p-2 text-white"
                    placeholder="Subject*"
                    value={subject}
                    onChange={(e) => {
                      handlerInput(setSubject, setSubjectError, e.target.value);
                    }}
                  />
                  <FormErrorMessage>Name is required.</FormErrorMessage>
                </FormControl>

                <FormControl isInvalid={messageError} isRequired>
                  <SlideFade offsetY="20px" in={message.length > 0}>
                    <FormLabel htmlFor="message" className="text-white">
                      Message
                    </FormLabel>
                  </SlideFade>
                  <Textarea
                    id="message"
                    name="message"
                    placeholder="Message*"
                    resize="none"
                    className="rounded-md bg-gray-900 p-2 text-white"
                    value={message}
                    onChange={(e) => {
                      handlerInput(setMessage, setMessageError, e.target.value);
                    }}
                  ></Textarea>
                  {/* Text error if not  */}
                  <FormErrorMessage>Message is required.</FormErrorMessage>
                </FormControl>
              </Box>
              <Button
                className="rounded-md bg-black p-2 text-white"
                colorScheme={
                  isSending ? 'blue' : successFullySend ? 'green' : errorSend ? 'red' : 'gray'
                }
                onClick={() => {
                  setErrors();
                  sendEmail();
                }}
              >
                {isSending ? (
                  <Spinner />
                ) : successFullySend ? (
                  <CheckCircleIcon />
                ) : errorSend ? (
                  <CrossCircledIcon />
                ) : (
                  'Send'
                )}
              </Button>
            </Box>
          </StyledBox>
          <StyledBox className="p-4 py-8 lg:p-8">
            <Heading size="md" className="pb-5 text-white lg:pb-10">
              About Me
            </Heading>
            <Box className="flex flex-row flex-wrap justify-around gap-2">
              <div
                className="badge-base LI-profile-badge"
                data-locale="en_US"
                data-theme="dark"
                data-size={isMobile ? 'sm' : 'large'}
                data-type="HORIZONTAL"
                data-vanity="florian-mangin"
                data-version="v1"
              ></div>
              {/* Github CARD */}
              <Box className="w-[330px] rounded-lg bg-black text-white">
                {/* github logo */}
                <Box className="h-[45px] rounded-t-lg bg-[#38434f] px-[16px] py-[8px]">
                  <Image
                    src="logo/github_logo_wide.svg"
                    alt="github logo"
                    width={92}
                    height={0}
                    className="rounded-sm bg-white p-1"
                  />
                </Box>
                {/* github user information */}
                <Box className="h-[216px] px-[16px]">
                  {user && (
                    <>
                      <Image
                        src={user.avatar_url}
                        alt="github user"
                        width={52}
                        height={52}
                        className="mb-2 mt-3 rounded-full border-2"
                      />
                      <Link className="font-semibold hover:underline" href={user.html_url}>
                        {user.login}
                      </Link>
                      <Text className="text-sm font-normal">
                        Passionate C#, Angular and Next.js developer.
                      </Text>
                      <Flex className="mt-3 flex flex-row flex-wrap gap-2">
                        {/* Techno */}
                        <Link href="https://angular.dev/">
                          <Tag colorScheme="red" size="sm">
                            <TagLabel className="hover:underline">Angular</TagLabel>
                          </Tag>
                        </Link>
                        <Link href="https://docs.microsoft.com/en-us/dotnet/csharp/">
                          <Tag colorScheme="purple" size="sm">
                            <TagLabel className="hover:underline">C#</TagLabel>
                          </Tag>
                        </Link>
                        <Link href="https://nextjs.org/">
                          <Tag colorScheme="black" size="sm">
                            <TagLabel className="hover:underline">Next.js</TagLabel>
                          </Tag>
                        </Link>
                        <Link href="https://www.java.com/en/" hidden={isMobile}>
                          <Tag colorScheme="red" size="sm">
                            <TagLabel className="hover:underline">Java</TagLabel>
                          </Tag>
                        </Link>
                        <Link href="https://www.typescriptlang.org/">
                          <Tag colorScheme="blue" size="sm">
                            <TagLabel className="hover:underline">TypeScript</TagLabel>
                          </Tag>
                        </Link>
                      </Flex>
                      <Flex className="my-2 mb-3 flex flex-row flex-wrap gap-2">
                        {/* Repos */}
                        <Tag size="sm">
                          <TagLabel className="hover:underline">
                            <Link href={`${user.html_url}?tab=repositories`}>
                              {repos.length} Repos
                            </Link>
                          </TagLabel>
                        </Tag>
                        <Tag size="sm">
                          <TagLabel>{getStargazerCount()} Stars</TagLabel>
                        </Tag>
                        <Tag size="sm">
                          <TagLabel>{getWatchersCount()} Watchers</TagLabel>
                        </Tag>
                      </Flex>
                      <a
                        className="rounded-full border border-white bg-black px-4 py-1 font-semibold text-white hover:bg-gray-950"
                        href={user.html_url}
                        target="_blank"
                      >
                        View profile
                      </a>
                    </>
                  )}
                </Box>
              </Box>
            </Box>
          </StyledBox>
        </Box>
      </div>

      <Script
        src="https://platform.linkedin.com/badges/js/profile.js"
        async
        defer
        type="text/javascript"
      ></Script>
    </>
  );
}
