/* -*- Mode: C++; tab-width: 2; indent-tabs-mode: nil; c-basic-offset: 2 -*-
 *
 * The contents of this file are subject to the Netscape Public License
 * Version 1.0 (the "NPL"); you may not use this file except in
 * compliance with the NPL.  You may obtain a copy of the NPL at
 * http://www.mozilla.org/NPL/
 *
 * Software distributed under the NPL is distributed on an "AS IS" basis,
 * WITHOUT WARRANTY OF ANY KIND, either express or implied. See the NPL
 * for the specific language governing rights and limitations under the
 * NPL.
 *
 * The Initial Developer of this code under the NPL is Netscape
 * Communications Corporation.  Portions created by Netscape are
 * Copyright (C) 1998 Netscape Communications Corporation.  All Rights
 * Reserved.
 */

#ifndef nsMessageBaseCID_h__
#define nsMessageBaseCID_h__

#include "nsISupports.h"
#include "nsIFactory.h"
#include "nsIComponentManager.h"

#define NS_MSGFOLDEREVENT_CID				              \
{ /* FBFEBE7A-C1DD-11d2-8A40-0060B0FC04D2 */      \
 0xfbfebe7a, 0xc1dd, 0x11d2,                      \
 {0x8a, 0x40, 0x0, 0x60, 0xb0, 0xfc, 0x4, 0xd2}}

#define NS_MSGGROUPRECORD_CID                     \
{ /* a8f54ee0-d292-11d2-b7f6-00805f05ffa5 */      \
 0xa8f54ee0, 0xd292, 0x11d2,                      \
 {0xb7, 0xf6, 0x00, 0x80, 0x5f, 0x05, 0xff, 0xa5}}

#define NS_MAILNEWSFOLDERDATASOURCE_CID                    \
{ /* 2B8ED4A4-F684-11d2-8A5D-0060B0FC04D2 */         \
    0x2b8ed4a4,                                      \
    0xf684,                                          \
    0x11d2,                                          \
    {0x8a, 0x5d, 0x0, 0x60, 0xb0, 0xfc, 0x4, 0xd2} \
}

#define NS_MAILNEWSMESSAGEDATASOURCE_CID                    \
{ /* 2B8ED4A5-F684-11d2-8A5D-0060B0FC04D2 */         \
    0x2b8ed4a5,                                      \
    0xf684,                                          \
    0x11d2,                                          \
    {0x8a, 0x5d, 0x0, 0x60, 0xb0, 0xfc, 0x4, 0xd2} \
}

#define NS_MESSAGEVIEWDATASOURCE_CID				\
{ /* 14495573-E945-11d2-8A52-0060B0FC04D2 */		\
0x14495573, 0xe945, 0x11d2,							\
{0x8a, 0x52, 0x0, 0x60, 0xb0, 0xfc, 0x4, 0xd2}}

#define NS_MSGACCOUNTMANAGER_CID									\
{ /* D2876E50-E62C-11d2-B7FC-00805F05FFA5 */			\
 0xd2876e50, 0xe62c, 0x11d2,											\
 {0xb7, 0xfc, 0x0, 0x80, 0x5f, 0x5, 0xff, 0xa5 }}

#define NS_MSGIDENTITY_CID												\
{ /* 8fbf6ac0-ebcc-11d2-b7fc-00805f05ffa5 */			\
 0x8fbf6ac0, 0xebcc, 0x11d2,											\
 {0xb7, 0xfc, 0x0, 0x80, 0x5f, 0x5, 0xff, 0xa5 }}

#define NS_MSGACCOUNT_CID													\
{ /* 68b25510-e641-11d2-b7fc-00805f05ffa5 */			\
 0x68b25510, 0xe641, 0x11d2,											\
 {0xb7, 0xfc, 0x0, 0x80, 0x5f, 0x5, 0xff, 0xa5 }}

// The filter service is used to acquire and manipulate filter lists.
#define NS_MSGFILTERSERVICE_CID                         \
{ 0x5cbb0700, 0x04bc, 0x11d3,                 \
    { 0xa5, 0x0a, 0x0, 0x60, 0xb0, 0xfc, 0x04, 0xb7 } }

/* e9a7cd70-0303-11d3-a50a-0060b0fc04b7 */
#define NS_MSGSEARCHSESSION_CID						  \
{ 0xe9a7cd70, 0x0303, 0x11d3,                 \
    { 0xa5, 0x0a, 0x0, 0x60, 0xb0, 0xfc, 0x04, 0xb7 } }

/* D5124441-D59E-11d2-806A-006008128C4E */
#define NS_MSGMAILSESSION_CID							\
{ 0xd5124441, 0xd59e, 0x11d2,							\
    { 0x80, 0x6a, 0x0, 0x60, 0x8, 0x12, 0x8c, 0x4e } }

/* 4A374E7E-190F-11d3-8A88-0060B0FC04D2 */
#define NS_MSGBIFFMANAGER_CID							\
{ 0x4a374e7e, 0x190f, 0x11d3,							\
    { 0x8a, 0x88, 0x0, 0x60, 0xb0, 0xfc, 0x4, 0xd2 } }

/* 7C601F60-1EF3-11d3-9574-006097222B83 */
#define NS_MSGNOTIFICATIONMANAGER_CID							\
{ 0x7c601f60, 0x1ef3, 0x11d3,							\
    { 0x95, 0x74, 0x0, 0x60, 0x97, 0x22, 0x2b, 0x83 } }

#define NS_COPYMESSAGESTREAMLISTENER_CID							\
{ 0x7741daed, 0x2125, 0x11d3,							\
    { 0x8a, 0x90, 0x0, 0x60, 0xb0, 0xfc, 0x4, 0xd2 } }

#endif // nsMessageBaseCID_h__
