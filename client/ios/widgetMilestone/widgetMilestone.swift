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
struct WidgetData: Decodable {
  var text: String
}
struct WidgetImage: Decodable {
  var data: String
}
struct Provider: IntentTimelineProvider {
  func placeholder(in context: Context) -> SimpleEntry {
    SimpleEntry(date: Date(), configuration: ConfigurationIntent(), text:"placeholder", imageData:"no image")
  }
  
  func getSnapshot(for configuration: ConfigurationIntent, in context: Context, completion: @escaping (SimpleEntry) -> ()) {
    let entry = SimpleEntry(date: Date(), configuration: configuration, text:"See who's posting", imageData:"no image")
    completion(entry)
  }
  
  func getTimeline(for configuration: ConfigurationIntent, in context: Context, completion: @escaping (Timeline<SimpleEntry>) -> ()) {
    let userDefaults = UserDefaults.init(suiteName: "group.com.ajiaron.milestonenative")
    //  var entries: [SimpleEntry] = []
    let currentDate = Date()
    //  for hourOffset in 0 ..< 5 {
    //      let entryDate = Calendar.current.date(byAdding: .hour, value: hourOffset, to: currentDate)!
    //      let entry = SimpleEntry(date: entryDate, configuration: configuration)
    //      entries.append(entry)
    // }
    if userDefaults != nil {
      let entryDate = Date()
      if let savedData = userDefaults!.value(forKey: "widgetKey") as? String,
         let savedImageData = userDefaults!.value(forKey: "widgetImage") as? String
      {
        let decoder = JSONDecoder()
 
        let data = savedData.data(using: .utf8)
        
        let imageData = savedImageData.data(using: .utf8)
        
        if let parsedData = try? decoder.decode(WidgetData.self, from: data!) {
         // if let imageData = Data(base64Encoded: savedImageData) {
          if let parsedImageData = try? decoder.decode(WidgetImage.self, from: imageData!) {
            // username, date and image are parsed
            let base64String = parsedImageData.data
            print(base64String)
            let nextRefresh = Calendar.current.date(byAdding: .minute, value: 1, to: entryDate)!
            let entry = SimpleEntry(date: nextRefresh, configuration: configuration, text: parsedData.text, imageData:base64String)
            let timeline = Timeline(entries: [entry], policy: .atEnd)
            completion(timeline)
          } // username, date parsed but image is not
          let nextRefresh = Calendar.current.date(byAdding: .minute, value: 1, to: entryDate)!
          let entry = SimpleEntry(date: nextRefresh, configuration: configuration, text: "image not parsed", imageData:"no image")
          let timeline = Timeline(entries: [entry], policy: .atEnd)
          completion(timeline)
        } else {
          // neither could be parsed
          print("Could not parse data")
          let nextRefresh = Calendar.current.date(byAdding: .minute, value: 1, to: entryDate)!
          let entry = SimpleEntry(date: nextRefresh, configuration: configuration, text: "cant parse", imageData:"no image")
          let timeline = Timeline(entries: [entry], policy: .atEnd)
          completion(timeline)
        }
      } else {
        // data not read from react native
        print("whats poppin")
        let nextRefresh = Calendar.current.date(byAdding: .minute, value: 1, to: entryDate)!
        let entry = SimpleEntry(date: nextRefresh, configuration: configuration, text: "pls work",
                    imageData:"no image")
        let timeline = Timeline(entries: [entry], policy: .atEnd)
        completion(timeline)
      }
    } else {
      let nextRefresh = Calendar.current.date(byAdding: .minute, value: 1, to: currentDate)!
      let entry = SimpleEntry(date: nextRefresh, configuration: configuration, text: "ah bro", imageData: "no image")
      let timeline = Timeline(entries: [entry], policy: .atEnd)
      completion(timeline)
    }
  }
}

struct SimpleEntry: TimelineEntry {
  let date: Date
  let configuration: ConfigurationIntent
  let text: String
  let imageData: String
}

struct widgetMilestoneEntryView : View {
  var entry: Provider.Entry
  var body: some View {
    ZStack {
      Color(red: 16, green: 16, blue: 16)
      
      VStack {
        HStack {

          if let imageURL = Bundle.main.url(forResource: "outline8", withExtension: "png") {
            ZStack {
              Circle()
                .foregroundColor(Color(red: 90, green: 90, blue: 90))
                .frame(width:46, height:46)
              Circle()
                .foregroundColor(Color(red: 60, green: 60, blue: 60))
                .frame(width:44, height:44)
              RemoteImage(url: imageURL)
                .aspectRatio(contentMode: .fit)
                .frame(width:34, height:34)
            }
          } else {
            Text("nothing worked")
              .bold()
              .foregroundColor(.white)
              .multilineTextAlignment(.center)
          }
        }
      } .padding(.top,-6)
        .padding(.trailing,-3)
        .padding(20)
        .frame(maxWidth: .infinity, maxHeight: .infinity, alignment: .topTrailing)
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
      }.padding(20)
        .padding(.bottom,2)
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
                .frame(width: 34, height: 34)
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
        .configurationDisplayName("My Widget")
        .description("This is an example widget.")
    }
}

struct widgetMilestone_Previews: PreviewProvider {
    static var previews: some View {
      widgetMilestoneEntryView(entry: SimpleEntry(date: Date(), configuration: ConfigurationIntent(), text:"sample text", imageData:"no image"))
            .previewContext(WidgetPreviewContext(family: .systemSmall))
    }
}
