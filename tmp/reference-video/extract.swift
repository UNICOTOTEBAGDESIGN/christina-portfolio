import Foundation
import AVFoundation
import AppKit
let url=URL(fileURLWithPath:"/Users/christinahuang/Downloads/ScreenRecording_10-15-2026 18.MP4")
let asset=AVURLAsset(url:url)
let duration=CMTimeGetSeconds(asset.duration)
print("Duration: \(duration) seconds")
let generator=AVAssetImageGenerator(asset:asset)
generator.appliesPreferredTrackTransform=true
generator.maximumSize=CGSize(width:1280,height:1280)
for i in 0..<12 {
 let seconds=max(0.1,duration*Double(i)/12)
 do {let cg=try generator.copyCGImage(at:CMTime(seconds:seconds,preferredTimescale:600),actualTime:nil)
 let bitmap=NSBitmapImageRep(cgImage:cg)
 let data=bitmap.representation(using:.png,properties:[:])!
 try data.write(to:URL(fileURLWithPath:"/Users/christinahuang/Desktop/body/little-universe-demo/tmp/reference-video/frame-\(i).png"))
 print("frame \(i): \(seconds)s")
 }catch{print(error)}
}
