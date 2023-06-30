//
//  SharedContainer.swift
//  milestonenative
//
//  Created by Aaron Jiang on 6/29/23.
//

import Foundation
import React
@objc(SharedContainer)
class SharedContainer: NSObject {

    @objc static func requiresMainQueueSetup() -> Bool {
        return true
    }

    @objc(getSharedContainerPath:withRejecter:)
    func getSharedContainerPath(resolve: @escaping RCTPromiseResolveBlock, reject: @escaping RCTPromiseRejectBlock) {
        let fileManager = FileManager.default
        if let containerURL = fileManager.containerURL(forSecurityApplicationGroupIdentifier: "group.com.ajiaron.milestonenative") {
            resolve(containerURL.path)
        } else {
            reject("SharedContainerError", "Could not get shared container path", nil)
        }
    }
}
