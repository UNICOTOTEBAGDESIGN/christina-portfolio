import AVFoundation
import AppKit
for i in 1...2 {
 let base=CommandLine.arguments[1]
 let asset=AVURLAsset(url:URL(fileURLWithPath:base+"/experiment-video-\(i).mp4"))
 print("Video \(i), duration \(CMTimeGetSeconds(asset.duration))")
 for t in asset.tracks(withMediaType:.video){print("Size \(t.naturalSize)")}
 let g=AVAssetImageGenerator(asset:asset);g.appliesPreferredTrackTransform=true;g.maximumSize=CGSize(width:1280,height:1280)
 let cg=try g.copyCGImage(at:CMTime(seconds:2,preferredTimescale:600),actualTime:nil)
 let rep=NSBitmapImageRep(cgImage:cg)
 try rep.representation(using:.jpeg,properties:[.compressionFactor:0.90])!.write(to:URL(fileURLWithPath:base+"/experiment-video-\(i)-poster.jpg"))
}
