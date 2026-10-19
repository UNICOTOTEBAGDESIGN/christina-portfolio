import AVFoundation
import Foundation
let asset=AVURLAsset(url:URL(fileURLWithPath:CommandLine.arguments[1]))
let track=asset.tracks(withMediaType:.video)[0]
let comp=AVMutableVideoComposition()
comp.renderSize=CGSize(width:960,height:540)
comp.frameDuration=CMTime(value:1,timescale:30)
let instruction=AVMutableVideoCompositionInstruction()
instruction.timeRange=CMTimeRange(start:.zero,duration:asset.duration)
let layer=AVMutableVideoCompositionLayerInstruction(assetTrack:track)
// Source contains 90px black mattes top/bottom, not part of the film image.
layer.setTransform(CGAffineTransform(a:1.0/3,b:0,c:0,d:1.0/3,tx:0,ty:-30),at:.zero)
instruction.layerInstructions=[layer];comp.instructions=[instruction]
let export=AVAssetExportSession(asset:asset,presetName:AVAssetExportPreset960x540)!
export.outputURL=URL(fileURLWithPath:CommandLine.arguments[2])
export.outputFileType = .mp4
export.shouldOptimizeForNetworkUse=true
export.videoComposition=comp
export.metadata=[]
export.exportAsynchronously{}
while export.status == .waiting || export.status == .exporting || export.status == .unknown {RunLoop.current.run(until:Date(timeIntervalSinceNow:0.2))}
print("Status: \(export.status.rawValue), error: \(String(describing:export.error))")
if export.status != .completed {exit(1)}
