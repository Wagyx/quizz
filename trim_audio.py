import os.path as osp
from pydub import AudioSegment 
from moviepy.editor import VideoFileClip
from glob import glob



def mainAudio():
    filenames = glob(r"data/japanese city pop/*.mp3")
    for filename in filenames:
        name, ext = osp.splitext(filename)
        fout = name+"-trimmed.mp3"
        trimMp3(filename, fout)    

def trimMp3(filename, fout, start=0, duration=30):
    song = AudioSegment.from_mp3(filename)
    # pydub does things in milliseconds 
    start = start * 1000
    duration = duration * 1000
    end = start + duration
    trimmedSong = song[start:end]
    trimmedSong.export(fout, format="mp3") 
    


def mp4tomp3(mp4file,mp3file):
    videoclip=VideoFileClip(mp4file)
    audioclip=videoclip.audio
    audioclip.write_audiofile(mp3file)
    audioclip.close()
    videoclip.close()
    
def trimMp4(filename, fout, t_start=0, duration=30):
    videoclip = VideoFileClip(filename)
    t_end = t_start + duration
    trimmedClip = videoclip.subclip(t_start, t_end)
    trimmedClip.write_videofile(fout)
    trimmedClip.close()
    videoclip.close()
    
def mainVideos():
    filenames = glob(r"data/japanese city pop/*.mp4")
    
    for filename in filenames:
        name, ext = osp.splitext(filename)
        fout = name+".mp3"
        mp4tomp3(filename, fout)
   
   
def mainAudioManual():
    filename = r"data/simple-quizz/yt1z.net - Lady Gaga - Bad Romance (Official Music Video) (128 KBps).mp3"
    name, ext = osp.splitext(filename)
    fout = name+"-trimmed.mp3"
    trimMp3(filename, fout,0,30)
    
def mainVideoManual():
    filename = r"data/simple-quizz/yt1z.net - One Piece - Opening 1 【We Are 】 4K 60FPS Creditless CC (480p).mp4"
    name, ext = osp.splitext(filename)
    fout = name+"-trimmed.mp4"
    trimMp4(filename, fout,0,30)
        
if __name__ == "__main__":
    # mainVideos()
    # mainAudio()
    # mainAudioManual()
    mainVideoManual()