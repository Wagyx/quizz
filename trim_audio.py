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
    
def mainVideos():
    filenames = glob(r"data/japanese city pop/*.mp4")
    
    for filename in filenames:
        name, ext = osp.splitext(filename)
        fout = name+".mp3"
        mp4tomp3(filename, fout)
   
   
def mainManual():
    filename = r"data/opera/qrgg.mp3"
    name, ext = osp.splitext(filename)
    fout = name+"-trimmed.mp3"
    trimMp3(filename, fout,10,30)       
        
if __name__ == "__main__":
    # mainVideos()
    # mainAudio()
    mainManual()