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

struct WidgetData: Decodable {
   var text: String
}
struct Provider: IntentTimelineProvider {
    func placeholder(in context: Context) -> SimpleEntry {
      SimpleEntry(date: Date(), configuration: ConfigurationIntent(), text:"placeholder")
    }

    func getSnapshot(for configuration: ConfigurationIntent, in context: Context, completion: @escaping (SimpleEntry) -> ()) {
      let entry = SimpleEntry(date: Date(), configuration: configuration, text:"Data goes here")
        completion(entry)
    }

    func getTimeline(for configuration: ConfigurationIntent, in context: Context, completion: @escaping (Timeline<Entry>) -> ()) {
      let userDefaults = UserDefaults.init(suiteName: "group.com.ajiaron.milestonenative")
      // var entries: [SimpleEntry] = []

      // Generate a timeline consisting of five entries an hour apart, starting from the current date.
      let currentDate = Date()
    //  for hourOffset in 0 ..< 5 {
     //     let entryDate = Calendar.current.date(byAdding: .hour, value: hourOffset, to: currentDate)!
      //    let entry = SimpleEntry(date: entryDate, configuration: configuration)
       //   entries.append(entry)
    // }

    if userDefaults != nil {
          let entryDate = Date()
          if let savedData = userDefaults!.value(forKey: "widgetData") as? String {
            let decoder = JSONDecoder()
            let data = savedData.data(using: .utf8)
            if let parsedData = try? decoder.decode(WidgetData.self, from: data!) {
                
                  let nextRefresh = Calendar.current.date(byAdding: .minute, value: 5, to: entryDate)!
                  let entry = SimpleEntry(date: nextRefresh, configuration: configuration, text: parsedData.text)
                  let timeline = Timeline(entries: [entry], policy: .atEnd)
                  completion(timeline)
              } else {
                  print("Could not parse data")
              }
            } else {
                print("whats poppin")
                let nextRefresh = Calendar.current.date(byAdding: .minute, value: 5, to: entryDate)!
                let entry = SimpleEntry(date: nextRefresh, configuration: configuration, text: "pls")
                let timeline = Timeline(entries: [entry], policy: .atEnd)
                completion(timeline)
            }
        }
      else {
        let nextRefresh = Calendar.current.date(byAdding: .minute, value: 5, to: currentDate)!
        let entry = SimpleEntry(date: nextRefresh, configuration: configuration, text: "ah bro")
        let timeline = Timeline(entries: [entry], policy: .atEnd)
        completion(timeline)
      }

    }
}

struct SimpleEntry: TimelineEntry {
    let date: Date
    let configuration: ConfigurationIntent
    let text: String
}

struct milestoneWidgetEntryView : View {
  var entry: Provider.Entry
  let entryDate = Date()
  let dateFormatter = DateFormatter()


  var body: some View {
    Color(red: 16, green: 16, blue: 16)
      .overlay(
      VStack {
        Text(entry.text)
          .bold()
          .foregroundColor(.white)
      }.padding(20)
    )
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
        milestoneWidgetEntryView(entry: SimpleEntry(date: Date(), configuration: ConfigurationIntent(), text: "Widget Preview"))
            .previewContext(WidgetPreviewContext(family: .systemSmall))
    }
}
