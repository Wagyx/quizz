import os.path as osp
import json 

def shuffleQuestions(data):
    categories = dict()
    for i,el in enumerate(data["questions"]):
        if not el["category"] in categories:
            categories[el["category"]] = list()
        categories[el["category"]].append(i)
    for k,v in categories.items():
        v.reverse()
    
    # get one item from each category at a time
    categoryNames = list(categories.keys())
    finalInd = list()
    indCategory = 0
    while len(categoryNames)>0:
        indCategory = indCategory % len(categoryNames)
        cat = categories[categoryNames[indCategory]]
        finalInd.append(cat.pop())
        if len(cat) > 0:
            indCategory +=1
        else:
            categoryNames.pop(indCategory)
    
    data["questions"] = [data["questions"][i] for i in finalInd]
    return data    
    
def removeAnswers(data):
    for el in data["questions"]:
        el.pop("answer")
    return data

def readJson(filename):
    with open(filename,encoding="utf-8") as f:
        data = json.loads(f.read())
    return data

def writeJson(fout, data):
    with open(fout, "w",encoding="utf-8") as f:
        f.write(json.dumps(data,ensure_ascii=False))
    

def main():
    filename = r"questions/quizz-simple-20250312.json"
    data = readJson(filename)
    
    # shuffle
    data = shuffleQuestions(data)
    fout,ext = osp.splitext(filename)
    fout = fout + "-shuffled"+ ext
    writeJson(fout, data)
    
    # remove answers
    data = removeAnswers(data)
    fout,ext = osp.splitext(fout)
    fout = fout + "-questionsOnly"+ ext
    writeJson(fout, data)

if __name__ == "__main__":
    main()    