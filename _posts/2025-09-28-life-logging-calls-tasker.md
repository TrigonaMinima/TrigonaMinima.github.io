---
layout: post
title: "Life Logging: Calls"
date: "2025-09-28"
categories: Quantified-self
---

I am building a comprehensive set of tools to do life logging. General idea is:

- Push everything to a sink; and
- Visualise the data in this sink.

Objective is to do weekly reviews and take interventions if things are not BAU. Long term vision is to eventually have enough signals to give me a comprehensive understanding of myself (physical, mental, social, financial, etc).

This post is about logging calls using [Tasker for Android](https://tasker.joaoapps.com/).


## Logging Phone Calls

Steps:

1. Trigger on the event "Phone Idle" (whenever the phone goes to an idle state - incoming call, missed call, and outgoing call)
2. Read the data provider `content://call_log/calls` to get the most recent call details
3. Format the details for my use
4. Push to an an endpoint that saves this data in a table.

This is how the logs looks like:

> #call(40) +type[miss] @num[Friend Number] @name[Friend nName] +mode[phone] +add[My Location]

> #call(40) +type[in] @num[Friend Number] @name[Friend nName] +mode[phone] +add[My Location]

> #call(84) +type[out] @num[Unsaved Caller's Number] @name[<null>] +mode[phone] +add[My Location]


<details closed>
<summary>Tasker profile to log phone calls</summary>
{% highlight shell linenos %}
Profile: Log Phone Calls
        Event: Phone Idle

    Enter Task: Call Logs

    A1: Variable Set [
        Name: %call_log_cols
        To: date, geocoded_location, countryiso, type, number, name, duration
        Structure Output (JSON, etc): On ]

    A2: SQL Query [
        Mode: URI Formatted
        File: content://call_log/calls
        Columns: %call_log_cols
        Order By: date desc
        Output Column Divider: ,
        Variable Array: %call_logs

    A3: Multiple Variables Set [
        Names: %qs_ts, %call_geocoded_location, %call_countryiso, %call_type, %call_number, %caller_name, %call_duration
        Variable Names Splitter: ,
        Values: %call_logs(1)
        Values Splitter: ,
        Structure Output (JSON, etc): On ]
        Use Global Namespace: On ]

    A4: Variable Clear [
        Name: %call_logs ]

    A5: If [ %qs_ts neq %LAST_CALLTS ]

        A15: If [ %call_type eq 1 ]

            A16: Variable Set [
                Name: %call_type
                To: in
                Structure Output (JSON, etc): On ]

        A17: Else
            If  [ %call_type eq 2 ]

            A18: Variable Set [
                Name: %call_type
                To: out
                Structure Output (JSON, etc): On ]

        A19: Else
            If  [ %call_type eq 3 ]

            A20: Variable Set [
                Name: %call_type
                To: miss
                Structure Output (JSON, etc): On ]

        A21: End If

        A22: Variable Set [
            Name: %qs_note
            To: #call(%call_duration) +type[%call_type] @num[%call_number] @name[%caller_name] +mode[phone]
            Structure Output (JSON, etc): On ]

        A23: Perform Task [
            Name: Commons: POST Note & Location
            Priority: %priority
            Local Variable Passthrough: On
            Limit Passthrough To: %qs_note, %qs_ts
            Structure Output (JSON, etc): On
            Continue Task After Error:On ]

        A24: Variable Set [
            Name: %LAST_CALLTS
            To: %qs_ts
            Structure Output (JSON, etc): On ]

    A25: End If

{% endhighlight %}
</details>

<!-- <br> -->

## Logging WhatsApp Calls

You can't read whatsapp calls from some data provider like normal phone calls. WhatsApp also doesn't support exporting the call logs. These calls are also not available in normal phone call logs. The only method was to read WhatsApp notification logs to get the details. Here are the steps:

1. Every time WhatsApp gives a notification, run the next set of steps.
2. If the notification was of a (audio/video) call, then get the data out in the relevant variables.
3. Push to an an endpoint that saves this data in a table.

Caveats:

1. WhatsApp generates separate calls related notifications:
    - incoming audio/video call
    - missed audio/call call (after an incoming call is missed)
    - If multiple calls have piled up then a separate notifation of (2+ missed calls from ...)
    - An outgoing calls just says: "calling..." --> so, no audio/video label.
1. Since this is just a call notification (incoming, outgoing), there is no call duration available

This is how the logs looks like:

> #call(-1) +type[miss] @num[null] @name[Friend Name] +mode[whatsapp-video] +add[My Location]

> #call(-1) +type[in] @num[null] @name[Friend Name] +mode[whatsapp-video] +add[My Location]

> #call(-1) +type[out] @num[null] @name[Friend Name] +mode[whatsapp-any] +add[My Location]



<details closed>
<summary>Tasker profile to log WA calls</summary>
{% highlight shell linenos %}
Profile: Log WhatsApp Calls
    	Event: Notification [ Owner Application:WhatsApp Title:* Text:* Subtext:* Messages:* Other Text:* Cat:* New Only:On ]

    Enter Task: WhatsApp Call Logs

    A3: If [ %evtprm7 eq call ]

        A4: Multiple Variables Set [
             Names: %qs_ts, %call_geocoded_location, %call_countryiso, %call_type_str, %call_number, %caller_name, %call_duration, %call_type,%call_mode
             Variable Names Splitter: ,
             Values: %TIMEMS,,,%evtprm3,null,%evtprm2,-1,null,any
             Values Splitter: ,
             Structure Output (JSON, etc): On ]

        A5: If [ %call_type_str ~R .*Calling.* ]

            A6: Variable Set [
                 Name: %call_type
                 To: out
                 Structure Output (JSON, etc): On ]

        A7: Else
            If  [ %call_type_str ~R .*Incoming.* ]

            A8: Variable Set [
                 Name: %call_type
                 To: in
                 Structure Output (JSON, etc): On ]

        A9: Else
            If  [ %call_type_str ~R .*Missed.* ]

            A10: Variable Set [
                  Name: %call_type
                  To: miss
                  Structure Output (JSON, etc): On ]

        A11: End If

        A12: If [ %call_type_str ~R .*voice.* ]

            A13: Variable Set [
                  Name: %call_mode
                  To: voice
                  Structure Output (JSON, etc): On ]

        A14: Else
            If  [ %call_type_str ~R .*video.* ]

            A15: Variable Set [
                  Name: %call_mode
                  To: video
                  Structure Output (JSON, etc): On ]

        A16: End If

        A17: Variable Set [
              Name: %qs_note
              To: #call(%call_duration) +type[%call_type] @num[%call_number] @name[%caller_name] +mode[whatsapp-%call_mode]
              Structure Output (JSON, etc): On ]

        A18: Flash [
              Text: %qs_note
              Continue Task Immediately: On
              Dismiss On Click: On ]

        A19: Perform Task [
              Name: Commons: POST Note & Location
              Priority: %priority
              Local Variable Passthrough: On
              Limit Passthrough To: %qs_note, %qs_ts
              Structure Output (JSON, etc): On
              Continue Task After Error:On ]

        A20: Write File [
              File: Download/wa_calls.txt
              Text: %qs_ts, %call_geocoded_location, %call_countryiso, %call_type_str, %call_number, %caller_name, %call_duration, %call_type,%call_mode
             %qs_note

              Append: On
              Add Newline: On ]

    A21: End If
{% endhighlight %}
</details>

<br>

Bye.
