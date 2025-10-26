with open("hackathon_train.csv", "r") as fin, open("hack.csv", "w") as fout:
    for _ in range(300000):
        fout.write(fin.readline())