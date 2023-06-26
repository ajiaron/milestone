//
//  milestoneWidget.swift
//  milestoneWidget
//
//  Created by Aaron Jiang on 6/25/23.
//

import WidgetKit
import SwiftUI
import Intents


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

    public var base64: String {
        return self.jpegData(compressionQuality: 1.0)!.base64EncodedString()
    }

    convenience init?(base64: String, withPrefix: Bool) {
        var finalData: Data?

        if withPrefix {
            guard let url = URL(string: base64) else { return nil }
            finalData = try? Data(contentsOf: url)
        } else {
            finalData = Data(base64Encoded: base64)
        }

        guard let data = finalData else { return nil }
        self.init(data: data)
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
      SimpleEntry(date: Date(), configuration: ConfigurationIntent(), text:"placeholder", imageData:"no image found")
    }

    func getSnapshot(for configuration: ConfigurationIntent, in context: Context, completion: @escaping (SimpleEntry) -> ()) {
      let entry = SimpleEntry(date: Date(), configuration: configuration, text:"Data goes here", imageData:"no image found")
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
              let imageDecoder = JSONDecoder()
              let data = savedData.data(using: .utf8)
              let imageData = savedImageData.data(using: .utf8)
              if let parsedData = try? decoder.decode(WidgetData.self, from: data!) {
                if let parsedImageData = try? imageDecoder.decode(WidgetImage.self, from: imageData!) {
                  // username, date and image are parsed
                  let nextRefresh = Calendar.current.date(byAdding: .minute, value: 1, to: entryDate)!
                  let entry = SimpleEntry(date: nextRefresh, configuration: configuration, text: parsedData.text, imageData:parsedImageData.data)
                  let timeline = Timeline(entries: [entry], policy: .atEnd)
                  completion(timeline)
                } // username, date parsed but image is not
                  let nextRefresh = Calendar.current.date(byAdding: .minute, value: 1, to: entryDate)!
                  let entry = SimpleEntry(date: nextRefresh, configuration: configuration, text: "image not parsed", imageData:"image not found")
                  let timeline = Timeline(entries: [entry], policy: .atEnd)
                  completion(timeline)
              } else {
                  // neither could be parsed
                  print("Could not parse data")
                  let nextRefresh = Calendar.current.date(byAdding: .minute, value: 1, to: entryDate)!
                  let entry = SimpleEntry(date: nextRefresh, configuration: configuration, text: "cant parse", imageData:"image not found")
                  let timeline = Timeline(entries: [entry], policy: .atEnd)
                  completion(timeline)
              }
            } else {
                  // data not read from react native
                  print("whats poppin")
                  let nextRefresh = Calendar.current.date(byAdding: .minute, value: 1, to: entryDate)!
                  let entry = SimpleEntry(date: nextRefresh, configuration: configuration, text: "pls work",
                  imageData:"")
                  let timeline = Timeline(entries: [entry], policy: .atEnd)
                  completion(timeline)
              }
      } else {
          let nextRefresh = Calendar.current.date(byAdding: .minute, value: 1, to: currentDate)!
        let entry = SimpleEntry(date: nextRefresh, configuration: configuration, text: "ah bro", imageData: "")
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

struct milestoneWidgetEntryView : View {
  var entry: Provider.Entry
  var body: some View {
    ZStack {
      Color(red: 16, green: 16, blue: 16)

        VStack {
          Text(entry.text)
            .bold()
            .foregroundColor(.white)
            .multilineTextAlignment(.center)
        }.padding(20)
    
    }
  }
}
@main

struct milestoneWidget: Widget {
    let kind: String = "milestoneWidget"

    var body: some WidgetConfiguration {
        IntentConfiguration(kind: kind, intent: ConfigurationIntent.self, provider: Provider()) { entry in
            milestoneWidgetEntryView(entry: entry)
        }
        .configurationDisplayName("My Widget")
        .description("This is an example widget.")
    }
}

struct milestoneWidget_Previews: PreviewProvider {
    static var previews: some View {
      milestoneWidgetEntryView(entry: SimpleEntry(date: Date(), configuration: ConfigurationIntent(), text: "Widget Preview", imageData:"no image found"))
            .previewContext(WidgetPreviewContext(family: .systemSmall))
    }
}
