import { CheckCircleIcon } from '@chakra-ui/icons';
import {
  Button,
  FormControl,
  FormErrorMessage,
  FormLabel,
  Input,
  SlideFade,
  Spinner,
  Textarea,
} from '@chakra-ui/react';
import { CrossCircledIcon } from '@radix-ui/react-icons';
import React, { useEffect } from 'react';

interface Props {
  email: string;
  setEmail: (email: string) => void;
  emailError: boolean;
  setEmailError: (error: boolean) => void;
  emailHelperMessage: string;
  emailIsError: () => boolean;
  subject: string;
  setSubject: (subject: string) => void;
  subjectError: boolean;
  setSubjectError: (error: boolean) => void;
  message: string;
  setMessage: (message: string) => void;
  messageError: boolean;
  setMessageError: (error: boolean) => void;
  setErrors: () => void;
  isSending: boolean;
  successFullySend: boolean;
  errorSend: boolean;
  handlerInput(setFieldError: (arg0: boolean) => void, input: string | any[]): void;
  sendEmail: () => void;
}

const FormSendEmail: React.FC<Props> = (props: Props) => {
  const {
    email,
    setEmail,
    emailError,
    setEmailError,
    emailHelperMessage,
    emailIsError,
    subject,
    setSubject,
    subjectError,
    setSubjectError,
    message,
    setMessage,
    messageError,
    setMessageError,
    setErrors,
    isSending,
    successFullySend,
    errorSend,
    handlerInput,
    sendEmail,
  } = props;
  useEffect(() => {
    if (email) {
      handlerInput(setEmailError, email);
      setEmailError(emailIsError());
    }
  }, [email, emailIsError, handlerInput, setEmail, setEmailError]);

  return (
    <>
      <FormControl isInvalid={emailError} isRequired>
        <SlideFade offsetY="20px" in={email?.length > 0}>
          <FormLabel htmlFor="email" className="text-sm text-zinc-400">
            Email
          </FormLabel>
        </SlideFade>
        <Input
          type="email"
          id="email"
          name="email"
          className="rounded-lg border-white/5 bg-white/[0.03] p-2 text-zinc-200 placeholder:text-zinc-600 focus:border-emerald-500/30"
          placeholder="Email*"
          value={email}
          onInput={(e) => {
            setEmail((e.target as HTMLInputElement).value);
          }}
        />
        <FormErrorMessage>{emailHelperMessage}</FormErrorMessage>
      </FormControl>
      <FormControl isInvalid={subjectError} isRequired>
        <SlideFade offsetY="20px" in={subject?.length > 0}>
          <FormLabel htmlFor="Subject" className="text-sm text-zinc-400">
            Subject
          </FormLabel>
        </SlideFade>
        <Input
          type="text"
          id="name"
          name="subject"
          className="rounded-lg border-white/5 bg-white/[0.03] p-2 text-zinc-200 placeholder:text-zinc-600 focus:border-emerald-500/30"
          placeholder="Subject*"
          value={subject}
          onChange={(e) => {
            setSubject(e.target.value);
            handlerInput(setSubjectError, e.target.value);
          }}
        />
        <FormErrorMessage>Name is required.</FormErrorMessage>
      </FormControl>

      <FormControl isInvalid={messageError} isRequired>
        <SlideFade offsetY="20px" in={message?.length > 0}>
          <FormLabel htmlFor="message" className="text-sm text-zinc-400">
            Message
          </FormLabel>
        </SlideFade>
        <Textarea
          id="message"
          name="message"
          placeholder="Message*"
          resize="none"
          className="rounded-lg border-white/5 bg-white/[0.03] p-2 text-zinc-200 placeholder:text-zinc-600 focus:border-emerald-500/30"
          value={message}
          onChange={(e) => {
            setMessage(e.target.value);
            handlerInput(setMessageError, e.target.value);
          }}
        />
        <FormErrorMessage>Message is required.</FormErrorMessage>
      </FormControl>
      <Button
        className="rounded-full border border-white/10 bg-white/[0.05] px-6 py-2 text-sm font-medium text-zinc-300 transition-all duration-300 hover:border-emerald-500/20 hover:bg-white/[0.1] hover:text-white"
        colorScheme={isSending ? 'blue' : successFullySend ? 'green' : errorSend ? 'red' : 'gray'}
        onClick={() => {
          setErrors();
          sendEmail();
        }}
      >
        {isSending ? (
          <Spinner size="sm" />
        ) : successFullySend ? (
          <CheckCircleIcon />
        ) : errorSend ? (
          <CrossCircledIcon />
        ) : (
          'Send'
        )}
      </Button>
    </>
  );
};

export default FormSendEmail;
