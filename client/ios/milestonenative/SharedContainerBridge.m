//
//  SharedContainerBridge.m
//  milestonenative
//
//  Created by Aaron Jiang on 6/29/23.
//

#import <React/RCTBridgeModule.h>
#import "SharedContainerBridge.h"
//#import "milestonenative-Bridging-Header.h"

@interface RCT_EXTERN_MODULE(SharedContainer, NSObject)
RCT_EXTERN_METHOD(getSharedContainerPath:(RCTPromiseResolveBlock)resolve rejecter:(RCTPromiseRejectBlock)reject)

//RCT_EXTERN_METHOD(getSharedContainerPath:(RCTPromiseResolveBlock)resolve rejecter:(RCTPromiseRejectBlock)reject)
@end

