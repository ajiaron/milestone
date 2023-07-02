//
//  widgetMilestone.swift
//  widgetMilestone
//
//  Created by Aaron Jiang on 6/26/23.
//

import WidgetKit
import SwiftUI
import Intents
import URLImage

import os
private let logger = Logger(subsystem: "com.ajiaron.milestonenative.widget", category: "WidgetExtension")
extension Color {
  init(red: Double, green: Double, blue: Double, opacity: Double = 1) {
    self.init(
      .sRGB,
      red: red / 255,
      green: green / 255,
      blue: blue / 255,
      opacity: opacity
    )
  }
}
extension UIImage {
  func resized(toWidth width: CGFloat, isOpaque: Bool = true) -> UIImage? {
    //let canvas = CGSize(width: width, height: CGFloat(ceil(width/size.width * size.height)))
    let canvas = CGSize(width: 145, height:145)
    let format = imageRendererFormat
    format.opaque = isOpaque
    return UIGraphicsImageRenderer(size: canvas, format: format).image {
      _ in draw(in: CGRect(origin: .zero, size: canvas))
    }
  }
}
let imageURL = Bundle.main.url(forResource: "outline8", withExtension: "png")

struct WidgetData: Decodable {
  var text: String
}
struct WidgetImage: Decodable {
  var data: String
}
struct Provider: IntentTimelineProvider {
  func placeholder(in context: Context) -> SimpleEntry {
    SimpleEntry(date: Date(), configuration: ConfigurationIntent(), text:"placeholder", imageData:Data())
  }
  
  func getSnapshot(for configuration: ConfigurationIntent, in context: Context, completion: @escaping (SimpleEntry) -> ()) {
    let entry = SimpleEntry(date: Date(), configuration: configuration, text:"Aaron posted 2 hours ago.", imageData:Data())
    completion(entry)
  }
  
  func getTimeline(for configuration: ConfigurationIntent, in context: Context, completion: @escaping (Timeline<SimpleEntry>) -> ()) {
    
    let userDefaults = UserDefaults.init(suiteName: "group.com.ajiaron.milestonenative")
    //  var entries: [SimpleEntry] = []
    let currentDate = Date()
  
    if userDefaults != nil {
      let entryDate = Date()
      if let savedData = userDefaults!.value(forKey: "widgetKey") as? String,
         let savedImageData = userDefaults!.string(forKey: "widgetImage")
      {
        let decoder = JSONDecoder()
        let data = savedData.data(using: .utf8)
        //savedImageData
        let imageContent = savedImageData.data(using: .utf8)
        if let parsedData = try? decoder.decode(WidgetData.self, from: data!) {
         // if let imageData = Data(base64Encoded: savedImageData) {
          if let parsedImageData = try? decoder.decode(WidgetImage.self, from: imageContent!) {
          //  username, date and image are parsed
          //  let urlString = parsedImageData.data
            var imageData: Data? = nil
            let fileURL = URL(fileURLWithPath: parsedImageData.data)
            let fileExists = FileManager.default.fileExists(atPath: parsedImageData.data)
            logger.log("File exists: \(fileExists)")
            if let loadedImageData = try? Data(contentsOf: fileURL) {
              logger.log("image loaded successfully")
              
                imageData = loadedImageData
                let nextRefresh = Calendar.current.date(byAdding: .minute, value: 1, to: entryDate)!
                let entry = SimpleEntry(date: nextRefresh, configuration: configuration, text: parsedData.text, imageData:imageData ?? Data())
                let timeline = Timeline(entries: [entry], policy: .atEnd)
                completion(timeline)
            }
            else {
              logger.log("image failed to load")
            }

          } // username, date parsed but image is not
          else {
            let nextRefresh = Calendar.current.date(byAdding: .minute, value: 1, to: entryDate)!
            let entry = SimpleEntry(date: nextRefresh, configuration: configuration, text: "image not parsed", imageData:Data())
            let timeline = Timeline(entries: [entry], policy: .atEnd)
            completion(timeline)
          }
        } else {
          // neither could be parsed
          print("Could not parse data")
          let nextRefresh = Calendar.current.date(byAdding: .minute, value: 1, to: entryDate)!
          let entry = SimpleEntry(date: nextRefresh, configuration: configuration, text: "cant parse", imageData:Data())
          let timeline = Timeline(entries: [entry], policy: .atEnd)
          completion(timeline)
        }
      } else {
        // data not read from react native
        print("whats poppin")
        let nextRefresh = Calendar.current.date(byAdding: .minute, value: 1, to: entryDate)!
        let entry = SimpleEntry(date: nextRefresh, configuration: configuration, text: "pls work",
                    imageData:Data())
        let timeline = Timeline(entries: [entry], policy: .atEnd)
        completion(timeline)
      }
    } else {
      let nextRefresh = Calendar.current.date(byAdding: .minute, value: 1, to: currentDate)!
      let entry = SimpleEntry(date: nextRefresh, configuration: configuration, text: "ah bro", imageData: Data())
      let timeline = Timeline(entries: [entry], policy: .atEnd)
      completion(timeline)
    }
  }
}

struct SimpleEntry: TimelineEntry {
  let date: Date
  let configuration: ConfigurationIntent
  let text: String
  let imageData: Data
 // let imageURL: String
}

struct widgetMilestoneEntryView : View {
  var entry: Provider.Entry
  var body: some View {
    ZStack {
      Color(red: 16, green: 16, blue: 16)
      VStack {
        HStack {
          VStack {
            
            
            
            if let uiImage = UIImage(data: entry.imageData) {
              ZStack {
                // Rectangle()
                //   .foregroundColor(Color(red: 60, green: 60, blue: 60))
                //   .frame(width: 64, height: 64)
                //   .clipShape(RoundedRectangle(cornerRadius:10))
                Image(uiImage: uiImage)
                  .resizable()
                  .scaledToFill()
                  .frame(width: 62, height: 73)
               // .aspectRatio(contentMode: .fit)
                  .clipShape(RoundedRectangle(cornerRadius:10))
                  .clipped()
              }
            } else {
              Rectangle()
                .foregroundColor(Color(red: 16, green: 16, blue: 16))
                 .frame(width: 64, height: 73)
                 .clipShape(RoundedRectangle(cornerRadius:10))
            }
          } .padding(.top,15.5)
            .padding(.leading,20)
          
            .frame(maxWidth: .infinity, maxHeight: .infinity, alignment: .topLeading)
          
    
          Spacer()
          
          
          if let imageURL = Bundle.main.url(forResource: "outline8", withExtension: "png") {
            
            ZStack {
              Circle()
                .foregroundColor(Color(red: 90, green: 90, blue: 90))
                .frame(width:43, height:43)
              Circle()
                .foregroundColor(Color(red: 60, green: 60, blue: 60))
                .frame(width:41, height:41)
              RemoteImage(url: imageURL)
                .aspectRatio(contentMode: .fit)
                .frame(width:31, height:31)
            }

            //       Spacer()
            .padding(.top, 14.5)
            .padding(.trailing, 15.5)
            .frame(maxWidth: .infinity, maxHeight: .infinity, alignment: .topTrailing)
          } else {
            Text("nothing worked")
              .bold()
              .foregroundColor(.white)
              .multilineTextAlignment(.center)
          }
        }
      }

          
        

      VStack {
        Spacer()
        let components = entry.text.split(separator: " ", maxSplits: 2, omittingEmptySubsequences: true)
        if components.count >= 3 {
          Text("\(String(components[0])) \(String(components[1])) ")
               .bold()
               .foregroundColor(.white)
               .font(.system(size: 16.5))
           + Text("\(String(components[2]))")
            .fontWeight(.bold)
               .foregroundColor(Color(red:63, green: 184, blue:156, opacity: 1))
               .font(.system(size: 16.5))
        } else {
          Text(entry.text)
            .bold()
            .foregroundColor(.white)
            .font(.system(size: 16.5))
        }
      }.padding(.top,20)
        .padding(.trailing, 20)
        .padding(.leading, 20)
        .padding(.bottom, 16)
    }
  }
}

struct RemoteImage: View {
    let url: URL
    var body: some View {
        if let imageData = try? Data(contentsOf: url),
           let uiImage = UIImage(data: imageData) {
            Image(uiImage: uiImage)
                .resizable()
                .cornerRadius(10)
                .clipped()
                .aspectRatio(contentMode: .fill)
                .padding(.top,-0.5)
                .frame(width: 31, height: 31)
        } else {
          Text("nothing worked")
            .bold()
            .foregroundColor(.white)
            .multilineTextAlignment(.center)
        }
    }
}

struct widgetMilestone: Widget {
    let kind: String = "widgetMilestone"

    var body: some WidgetConfiguration {
        IntentConfiguration(kind: kind, intent: ConfigurationIntent.self, provider: Provider()) { entry in
            widgetMilestoneEntryView(entry: entry)
        }
        .configurationDisplayName("Latest Post")
        .description("View the latest activity on your feed straight from your home screen.")
    }
}

struct widgetMilestone_Previews: PreviewProvider {
    static var previews: some View {
      widgetMilestoneEntryView(entry: SimpleEntry(date: Date(), configuration: ConfigurationIntent(), text:"sample text", imageData:Data()))
            .previewContext(WidgetPreviewContext(family: .systemSmall))
    }
}
