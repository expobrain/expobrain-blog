---
categories:
- Guides
class: post-template
comments: true
cover: media/unit_test_mocking.jpg
current: post
date: 2013-08-27 18:49:31
layout: post
navigation: true
slug: mocking-objects-in-unit-tests
subclass: post
tags:
- mock
- python
- unit tests
title: Mocking objects in unit tests
wordpress_id: 1542
---

Unit testing is important to ensure the stability and the correctness of the code throughout all lifespan of the project. However, testing some code requires a connection to external services (like SMTP, web, etc.) which in all cases must be avoided to simplify the test and development environment and to not add external variables which can alter the result of the tests.

The [`mock`](http://www.voidspace.org.uk/python/mock/) Python package is the perfect candidate to replace modules, classes and/or functions and methods with mocks. The mock object can be scripted to act like the original object decoupling the unit test form the external dependency and providing a deterministic environment.

In this post I'll show how to mock the [`smtplib.SMTP`](http://docs.python.org/2/library/smtplib.html#smtplib.SMTP) class to run a unit test without a real SMTP server.

<!-- more -->

## Mocking and object

To explain the mock of the `smtplib.SMTP` object lets start from this simple piece of code:

    # Content of example.py

    import smtplib
    from email.mime.text import MIMEText


    def build_message(sender, recipients, subject, body):
        msg = MIMEText(body)
        msg['Subject'] = subject
        msg['From'] = sender
        msg['To'] = ",".join(recipients)

        return msg


    def send_message(msg):
        s = smtplib.SMTP("smtp.mydomain.com")
        result = s.sendmail(msg["From"], msg["To"].split(","), msg.as_string())
        s.quit()

        return result

Two functions: `build_message()` build a `MIMEText` instance from the function's arguments, `send_message()` sends the message to its recipients by SMTP. Nothing new about the standard usage pattern of `smtplib`, our goal is to provide a way to unit test this code without altering it and/or having a SMTP real server for testing.

Mocking the `smtplib.SMTP` means we need to replace the original implementation with a mock, lets the code use the mock during the execution of the test and place back the original implementation of the object when finished. All this process is done automatically by using the `with` context manager, all the code executed inside the context manager will use the mocked object instead the real one.

Here the first implementation of the unit test using the context manager:

    # Content of example_tests.py

    from mock import patch, call
    import unittest
    import smtplib
    import example


    class SendEmailTests(unittest.TestCase):

        def test_send_email(self):
            # Mock 'smtplib.SMTP' class
            with patch("smtplib.SMTP") as mock_smtp:
                # Build test message
                from_address = "from@domain.com"
                to_address = "to@domain.com"

                msg = example.build_message(
                    from_address, [to_address], "subject", "message")

                # Send message
                example.send_message(msg)

The `mock.path` function replaces the object with the name passed as the first argument returning a reference `mock_smtp` of the mocked object; this ill be useful later. The rest of the code just set up a test message and calls the `send_message()` function.

This is where the magic happens: the `send_message()` functions will execute normally without any changes in its behaviour despite the `SMTP` class is not the original one but a mock we created a couple of line before.

Now that the function is executed we can fetch the mock object and do some testing on it. The `mock` package has a useful list of properties and methods to simplify the test on mocked objects. but first of all we retrieve an instance of the `SMTP` class (the `mock_smtp` is a pointer to the mocked **class** not to the mocked **instance** of `SMTP`):

                # Get instance of mocked SMTP object
                instance = mock_smtp.return_value

Now we can check if `sendmail()` functions was called at least once:

                # Checks the mock has been called at least one time
                self.assertTrue(instance.sendmail.called)

or we can check if the function was called exactly once:

                # Check the mock has been called only once
                self.assertEqual(instance.sendmail.call_count, 1)

Checking if a function is called and/or is called a certain number of times is not so much helpful. Checking if a function was called with a precise set of arguments and keywords is much more helpful:

                # Check the mock has been called with a specific list of arguments
                # and keywords
                instance.sendmail.assert_any_call(
                    from_address, [to_address], msg.as_string())

This checks if `sendmail()` has been called at least once with the given list of arguments and keywords, we can however to narrow down the cases to only one call to `sendmail()` with or arguments' list so multiple calls of the functions will fail the test:

                # Check the mock has been called ONLY once the given arguments and
                # keywords
                instance.sendmail.assert_called_once_with(
                    from_address, [to_address], msg.as_string())

Another equivalent way to achieve that is to compare the list of calls of the mocked `sendmail()` function with a list of expected calls with arguments:

                # Check the mock' calls are equal to a specific list of calls in a
                # specific order
                self.assertEqual(
                    instance.sendmail.mock_calls,
                    [call(from_address, [to_address], msg.as_string())]
                )

## Decorators

An object can be mocked and accessed inside a context manager but `mock` provides a way to achieve the same behaviour by decorating the unit test:

        @patch("smtplib.SMTP")
        def test_send_email_with_decorator(self, mock_smtp):
            # Build test message
            from_address = "from@domain.com"
            to_address = "to@domain.com"

            msg = example.build_message(
                from_address, [to_address], "subject", "message")

            # Send message
            example.send_message(msg)

            # Check
            mock_smtp.return_value.sendmail.assert_called_once_with(
                from_address, [to_address], msg.as_string())

The result is the same as using a context manager, but we'll save an indentation level. Note that the mocked object is passed as the first argument of the decorated function.

## Returning custom values

Remember the scope of a mock is to act like the original object which means it should be able to return values on function calls. To do so the `Mock` class has a `return_value` attribute which can be set to the value to be returned everytime the function is called. IN the example I'm returning a dictionary with a recipient refused by the remote server with a code and description:

        @patch("smtplib.SMTP")
        def test_one_recipient_refused(self, mock_smtp):
            # Build test message
            from_address = "from@domain.com"
            to_addresses = ["first@domain.com", "second@domain.com"]

            msg = example.build_message(
                from_address, to_addresses, "subject", "message")
            error = {
                to_addresses[0]:
                    (450, "Requested mail action not taken: mailbox unavailable")
            }

            # Returns a send failur for the first recipient
            instance = mock_smtp.return_value
            instance.sendmail.return_value = error

            # Call 'send_message' function
            result = example.send_message(msg)

            # Check returned value
            self.assertIsInstance(result, dict)
            self.assertEqual(result, error)

## Raising exceptions

The `Mock` class doesn't just expose methods to integrate it into a unit tests environment but can be also instructed to react to calls to be able to test different real-life situation. In this example I'm simulate a `SMTPRecipientsRefused` exception raised when all the recipients are refused by the SMTP server:

        @patch("smtplib.SMTP")
        def test_raises_recipients_refused(self, mock_smtp):
            # Raises an 'SMTPRecipientsRefused' exception
            instance = mock_smtp.return_value
            instance.sendmail.side_effect = smtplib.SMTPRecipientsRefused({})

            # Build test message
            from_address = "from@domain.com"
            to_address = "to@domain.com"

            msg = example.build_message(
                from_address, [to_address], "subject", "message")

            # Check raises and exception when sending the message
            self.assertRaises(
                smtplib.SMTPRecipientsRefused, example.send_message, msg)

The `sendmail.side_effect` attribute can be any callable to dynamically return values when the `sendmail()` function is called or, if it's a exception class or instance, raises the exception when the function is called. It's trivial to check if the correct exception is raised using the `assertRaises()` method.

## Conclusion

The `mock` package is a perfect tool to mock and simulate external dependencies of your code. In this example I explained how to simulate a SMTP server in a unit test but you can mock everything from network libraries to file system calls and event some part of your own project's source code. Especially in BDD replacing some part of the code with mocks simplify the write of the unit test and speed up itys execution (for example if we are writing a unit test of a piece of code which calls our `send_message()` function it will be easier and faster to mock the function itself than mocking the SMTP class).

In this post I used only a fraction of the features exposed by the `mock` package, visit the package's [web site](http://www.voidspace.org.uk/python/mock/) to discover more.
