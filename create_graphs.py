import pandas as pd
import numpy as np
import matplotlib.pyplot as plt

def workshop_type_bar():
    raw = np.array([0,0,0,0,0,1,1,1,2,2,2,2,2,2,2,3,3,3,3,4,4,4,4])

    # raw = np.array(df["workshop"])
    counts = np.bincount(raw)

    labels = np.array(["Grassroots","Child Trafficking","First Responder","Safe Migration", "Young@HAART"])
    index = np.arange(len(labels))
    plt.bar(index, counts)
    plt.xlabel('Workshop Types', fontsize=5)
    plt.ylabel('Number Of Workshops', fontsize=5)
    plt.xticks(index, labels, fontsize=5, rotation=30)
    plt.title('Number of Workshops by Type')
    return plt
    # plt.savefig("bar.png")

def age_bar():
    raw = np.array([0,0,0,0,0,1,1,1,2,2,2,2,2,2,2,3,3,3])
    # raw = np.array(df["agegroup"])
    counts  = np.bincount(raw)
    labels = np.array(["below 18", "18-35","36-55","56+"])
    index = np.arange(len(labels))
    plt.bar(index, counts, color=(0.0, 0.8, 0.2, 0.6))
    plt.xlabel("Age Groups", fontsize =5 )
    plt.ylabel ("Number of Workshops Catered To", fontsize = 5)
    plt.xticks(index, labels , fontsize =5 , rotation = 30)
    plt.title("Number of Workshops Catered to Each Age Group")
    plt.show()
    plt.savefig("bar.png")

def target_group_bar():
    raw = np.array(df["targetgroup"])
    counts = np.bincount(raw)
    labels = np.array(["Youth","Women's Groups","Church Groups","First Responders", "Children", "Community Groups"])
    index = np.arange(len(labels))
    plt.bar(index, counts, color=(0.8, 0.2, 0.8, 0.6))
    plt.xlabel("Target Groups", fontsize =5)
    plt.ylabel("Number of Workshops Catered For", fontsize = 5)
    plt.xticks(index,labels,fontsize = 5, rotation = 30)
    plt.title("Number of Workshops Catered to Each Target Group")

    plt.savefig("bar.png")

def exploitation_type_bar_by_area():
    raw = np.array(df["area"])
    labels = np.array(["Child Labor", "Sexual Exploitation", "Organ Removal", "Forced Adult Marriage", "Child Marriage", "Forced Labor","Begging", "Others"])
    index = np.array(range(len(labels)))
    unique_areas = np.unique(raw)
    num_graphs =  len(unique_areas)
    for i in unique_areas:
        in_area = df["area"] == i
        single_area_data = df[in_area]
        type_count = np.bincount(single_area_data[exploitation_type])
        plt.bar(index,type_count, color = (0.8, 0.9, 0.1, 0.8))
        plt.xlabel(i, fontsize= 5)
        plt.ylabel("Count", fontsize =5)
        plt.xticks(index, labels,fontsize = 5, rotation = 30)
        plt.title("Exploitation Type in {}".format(i))
        plt.savefig("Exploitation_Type_{}.jpg".format(i))

def types_pie():
    raw = np.array(df["trafficking_types"])
    labels = np.array(["Internal", "Cross Border"])
    values = np.bincount(raw)
    fig1, ax1 = plt.subplots()
    ax1.pie(values, explode=explode, labels=labels, autopct='%1.1f%%',
        shadow=True, startangle=90)
    ax1.axis('equal')
    plt.show()
    plt.savefig("pie_type.png")

def source_bar():
    raw = np.array(df["area"])
    unique_areas = np.unique(raw)
    values =  len(unique_areas)
    area_num = 0
    for i in unique_areas:

        in_area = df["area"]== i
        single_area_data = df[in_area]
        values[area_num] = np.bincount(np.array(single_area_data["source"])[1])
        area_num+=1
    index = np.array(range(len(unique_areas)))
    plt.bar(index, values)
    plt.xlabel("Areas")
    plt.ylabel("count")
    plt.xticks(index,labels,fontsize = 5, rotation =20)
    plt.title("source concentration by area")
    plt.show()
    plt.savefig("source.png")




# def target_bar():
    # raw = np.array(df[""])
if __name__ == "__main__":
    x = workshop_type_bar()
    x.show()
    age_bar()
