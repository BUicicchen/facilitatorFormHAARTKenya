def stairs(num) :
    if num == 1 or num == 0:
        return 1
    holdNum = [0] * (num + 1)
    holdNum[0] = 1
    holdNum[1] = 1
    holdNum[2] = 2
     
    for x in range(3, num + 1) :
        holdNum[x] = holdNum[x - 1] + holdNum[x - 2] + holdNum[x - 3]
     
    return holdNum[num]


def stairsRec(num):
    if num == 0 or num == 1:
        return 1
    elif num == 2:
        return 2
    else:
        return stairsRec(num - 1) + stairsRec(num - 2) + stairsRec(num - 3)
