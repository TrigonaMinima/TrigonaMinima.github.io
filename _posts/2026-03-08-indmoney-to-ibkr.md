---
layout: post
title: "Move US Stocks from INDMoney to Interactive Brokers"
date: "2026-03-08"
categories: Investing
---

I wanted to move my US stocks (securities) from INDMoney to Interactive Brokers. I didn't find any clear steps documented anywhere. It took me multiple attempts to finally be able to move over my portfolio.

This post is divided into two parts: steps followed and FAQs.


## Steps

Absolute Pre-requisites

1. Have an active account on IBKR. That means account verified and ready to buy stocks.
2. Make your fractional shares whole on INDMoney. That means either going from 1.6 qty to 1 qty or 2 qtys.
3. Keep at least *USD 70* in the INDMoney wallet.


Now, here are the steps to transfer:

1. Log into IBKR.
2. In the menu, go to `Tansfers (Deposit, Withdraw and Transfer History)` (or whatever they are calling it now).
3. Go to `Transfer Positions`.
3. Select `Incoming`
4. Select region as `United States` as DriveWealth, the broker used by INDMoney, is in US.
5. Select `ACATS` as the transfer method. (usually the very first option and the most convenient)
6. Choose `DriveWealth` in the broker dropdown.
7. My account number looked like: `IFSC-XXX-<Account number on the INDMoney app>` (17 characters). Account number is the crucial part. One of my requests failed becuase of this. INDMoney doesn't make it easy to find your account number. DON'T use the one shown on the app. Follow: `US Stocks Tab` → `Manage` → `US Stocks Reports` → `US Trades Report` to find your account numner.
8. Account Title and Tax Identification Number are pre-selected. Choose your Account Type. Mine was `Individual`.
9. Decide `FULL ACATS` or `PARTIAL ACATS` transfer. I did FULL ACATS. You can't have any fractional shares for full transfer. Refer FAQs for more details.
10. Give authorisation to IBKR to take appropriate actions when the positions of you are transferring are not the products IBKR supports. IBKR has given details on what you are giving them the authorisation for. I selected `Yes` for everything.
11. Verify your details. Sign and submit.

IBKR will validate and confirm the request, submit it to the DriveWealth, receive the stocks. You will get an email from IBKR about the completion or failure.

## FAQs

**Q:** What are the tax implications of the transfer process?  
**A:** My research told me that transferring stocks incurs *no capital gains tax*, as it's a dealer transfer, not a sale. Verify with your CA. Notwithstanding, maintain your transaction records with the earlier platform for tax filing purposes.

**Q:** Who is INDMoney's broker?  
**A:** DriveWealth

**Q:** Region to select for the transfer.  
**A:** DriveWealth is a US broker. So region is United States of America.

**Q:** What is incoming ACATS and outgoing ACATS?  
**A:** Since I wanted to get the securities out of DriveWealth, it is going to be an *outgoing ACATS* for DriveWealth and *incoming ACATS* for Interactive Brokers.

**Q:** Who initiates the ACATS (Automated Customer Account Transfer Service) transfer request?  
**A:** Always the receiving broker. So, there is no need to interact with INDMoney unless there is some snag in the process and you need help.

**Q:** Is DriveWealth (INDMoney's underlying broker) ACATS transfer enabled?  
**A:** Yes, I confirmed this with INDMoney.

**Q:** Does DriveWealth charge a fee for the (outbound) transfer?  
**A:** Yes, I was charged *USD 65*. I confirmed this with an INDMoney customer support request. Their explanation:

> For outgoing ACATS transfers, a fee is typically applied by your U.S. broker. This charge is levied by the broker currently holding your assets to facilitate the transfer out of their system.

**Q:** How do I pay for the DriveWealth fee?  
**A:** Keep at least USD 70 in the INDMoney wallet.

**Q:** Does IBKR charge a fee for the (inbound) transfer?  
**A:** I was *not* charged anything.

**Q:** Is there a penalty for transfer failures due to any errors?  
**A:** I was *not* charged anything. I successfully transfer in my third attempt.

**Q:** How long does it take to complete the transfer after submission.  
**A:** It took 4 working days from submission to completion for me. Under standard conditions, ACATS transfers to IBKR complete in about 4–8 business days after submission.

> Gemini says that some industry sources note 3–5 business days in smooth cases. 

**Q:** Can I trade on INDMoney during my transfer process?  
**A:** I avoided it after I raised my transfer request. INDMoney's response:

> During the outgoing ACATS transfer, trading activity (including deposits, buys, and sells) will be temporarily restricted to ensure the process completes without errors.

**Q:** Can I trade on IBKR during my transfer process?  
**A:** Yes.

**Q:** How does it work if the residency status has changed - INDMoney app having residency A and IBKR having residency B?  
**A:** Many people on this [reddit thread](https://www.reddit.com/r/INDmoneyApp/comments/1o1wxdj/how_to_handle_us_stock_investments_after_becoming/) seemed to think so. I tried, and it worked for me.

**Q:** My address is different on INDMoney and IBKR. Will it work?  
**A:** It worked for me. According to Gemini, the ACATS system relies on an **exact match** of key identifying information between the delivering account (INDmoney's partner broker) and the receiving account (IBKR) to prevent unauthorized transfers. The key matching criteria is:

- Account Title/Registration: Your name must be identical on both accounts.
- Account Type: (e.g., Individual, Joint, etc.) must match.
- Tax ID: (e.g., Social Security Number, or other tax identification used) must match.

All three were supplied by me. So, I guess that's enough. I think it would have mattered if my country of residence had been US, because then my Tax ID would have changed.

**Q:** How do I track my transfer?  
**A:** INDMoney doesn't tell you anything about the transfer or the status. You will not even get a notification/email after the transfer is complete. Only place to track the transfer is on IBKR. Follow the same steps that you followed to initiate the transfer. IBKR will guide to the the status window.

**Q:** How are fractional shares handled?  
**A:** This caused a lot of research for me. Everyone online mentioned that you can't transfer fractional shares. INDMoney also confirmed this:

> Please note that fractional shares cannot be transferred. These may be liquidated as part of the transfer process.

So this was clear. What was not clear was: do I need to make them whole or will it only transfer the complete units and leave the fractional units in INDMoney? The latter part of INDMoney's response gave the impression that it will handle the liquidation on it's own. This assumption was incorrect. My request was rejected because of fractional shares.

So, as I mentioned in the pre-requisites, make your fractional shares whole or exit entirely. That is, turn 3.55 units of NVDA into 3 or 4 or 0 units or NVDA.

**Q:** Can I use partial transfer to avoid selling my fractional shares?  
**A:** I was always trying for full transfer. When the request was rejected due to fractional shares, I contemplated using partial transfer to avoid exiting. I was avoiding selling for two reasons:

- I wasn't sure if selling would lead to any tax implications;
- Some of my stocks were bought at very attractive prices. I want to protect my avg price.

After some thought, I decided to make them whole. Exited some of the fractional shares and bought some of the others (when there was a dip).

**Q:** Does the ACATS transfer also take care of transfering my buy/sell history, avg price and other associated history?  
**A:** Not sure what is supposed to be transfered. What I got was only my avg price. All the past buy-sell history was gone. Since it was gone, my CAGR type metrics were also gone.

**Q:** What resources did you refer to understand the process?  
**A:** Here are some links

- [Paasa Blog](https://paasa.com/blog/transfer-indmoney-to-paasa)
- [Vested support](https://support.vestedfinance.com/portal/en/kb/articles/how-do-i-migrate-my-us-brokerage-account-from-indmoney-stockal-to-vested-31-1-2024)
- [Groww blog](https://groww.in/blog/how-to-transfer-us-stocks-from-groww-to-external-platform)
- [X/Twitter: 🚛 How to transfer your US Holdings out of Groww?](https://x.com/thetrickytrade/status/1749719803777147123)
- [Reddit Question 1](https://www.reddit.com/r/INDmoneyApp/comments/1meyz4u/has_anyone_successfully_transferred_their/)
- [Reddit discussion: how to handle INDMoney US investments after becoming NRI](https://www.reddit.com/r/INDmoneyApp/comments/1o1wxdj/how_to_handle_us_stock_investments_after_becoming/)

<br>
