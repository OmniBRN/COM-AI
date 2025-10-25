import numpy as np
import pandas as pd
from collections import Counter
import random
import math
from datetime import datetime

def gini(v):
    if len(v)==0:
        return 0.0
    counts= np.bincount(v)
    probabilities= counts/counts.sum()
    
    return 1.0- sum(probabilities**2)

def weight_gini(v_left, v_right):
    n= len(v_left) +len(v_right)
    return (len(v_left)/n)* gini(v_left)+ (len(v_right)/n)* gini(v_right)

def haversine(lat1, lon1, lat2, lon2):
    R = 6371  # km
    # Convertim grade în radiani
    phi1, phi2 = math.radians(lat1), math.radians(lat2)
    d_phi = math.radians(lat2 - lat1)
    d_lambda = math.radians(lon2 - lon1)

    a = math.sin(d_phi / 2)**2 + math.cos(phi1) * math.cos(phi2) * math.sin(d_lambda / 2)**2
    c = 2 * math.atan2(math.sqrt(a), math.sqrt(1 - a))
    distance = R * c
    return distance

class DecisionTree:
    def __init__(self, max_depth=6, min_samples_split=10, max_features=None, random_state=None):
        self.max_depth = max_depth
        self.min_samples_split = min_samples_split
        self.max_features = max_features  # number or None (use all)
        self.random_state = random_state
        self.tree_ = None
        self.feature_types = None  # list of 'numeric' or 'categorical'

    def fit(self, X, y, feature_types):
        """
        X: numpy array shape (n_samples, n_features)
        y: integer labels 0/1
        feature_types: list of 'numeric' or 'categorical' for each column
        """
        if self.random_state is not None:
            random.seed(self.random_state)
            np.random.seed(self.random_state)
        self.feature_types = feature_types
        self.n_features_ = X.shape[1]
        self.tree_ = self._build_tree(X, y, depth=0)

    def _build_tree(self, X, y, depth):
        # stopping criteria
        n_samples = len(y)
        num_labels = len(np.unique(y))
        if (depth >= self.max_depth) or (n_samples < self.min_samples_split) or (num_labels == 1):
            # return leaf: store class counts and predicted class
            counts = Counter(y)
            prediction = counts.most_common(1)[0][0]
            return ("leaf", prediction, dict(counts))

        # choose subset of features for this split (random feature sampling for RF)
        if self.max_features is None:
            feat_indices = list(range(self.n_features_))
        else:
            k = self.max_features
            k = min(k, self.n_features_)
            feat_indices = list(np.random.choice(range(self.n_features_), size=k, replace=False))

        best_feat = None
        best_thresh = None
        best_gain = 0.0
        best_left_idx = None
        best_right_idx = None
        best_is_cat_ordering = None  # for categorical splits store ordering array

        parent_gini = gini(y)

        # examine candidate splits
        for feat in feat_indices:
            col = X[:, feat]
            ftype = self.feature_types[feat]
            if ftype == "numeric":
                # numeric thresholds: try unique values midpoints
                uniq = np.unique(col)
                if len(uniq) == 1:
                    continue
                # Candidate thresholds: midpoints between sorted unique values
                # But to reduce computation, if too many unique values sample candidate thresholds
                if len(uniq) > 100:
                    # sample 100 unique values as candidates
                    cand = np.unique(np.percentile(uniq, np.linspace(0, 100, 101)))[1:-1]
                else:
                    cand = (uniq[:-1] + uniq[1:]) / 2.0
                for t in cand:
                    left_idx = col <= t
                    right_idx = ~left_idx
                    if left_idx.sum() == 0 or right_idx.sum() == 0:
                        continue
                    ig = parent_gini - weight_gini(y[left_idx], y[right_idx])
                    if ig > best_gain:
                        best_gain = ig
                        best_feat = feat
                        best_thresh = t
                        best_left_idx = left_idx
                        best_right_idx = right_idx
                        best_is_cat_ordering = None

            else:  # categorical
                # transform categories into ordering by target mean, then treat as numeric
                categories = np.unique(col)
                if len(categories) == 1:
                    continue
                # compute fraud rate for each category
                cat_rates = {}
                for cat in categories:
                    mask = col == cat
                    if mask.sum() == 0:
                        cat_rates[cat] = 0.0
                    else:
                        cat_rates[cat] = y[mask].mean()
                # order categories by increasing fraud rate (low -> high)
                ordered = sorted(categories, key=lambda c: cat_rates[c])
                # map categories to integers according to this order
                mapped = np.array([ordered.index(v) for v in col])
                uniq_mapped = np.unique(mapped)
                if len(uniq_mapped) == 1:
                    continue
                # candidate thresholds on mapped ordering
                cand = (uniq_mapped[:-1] + uniq_mapped[1:]) / 2.0
                for t in cand:
                    left_idx = mapped <= t
                    right_idx = ~left_idx
                    if left_idx.sum() == 0 or right_idx.sum() == 0:
                        continue
                    ig = parent_gini - weight_gini(y[left_idx], y[right_idx])
                    if ig > best_gain:
                        best_gain = ig
                        best_feat = feat
                        best_thresh = t
                        best_left_idx = left_idx
                        best_right_idx = right_idx
                        # we need to remember the ordered list to map future rows at predict time
                        best_is_cat_ordering = ordered

        # if no valid split found → make leaf
        if best_feat is None:
            counts = Counter(y)
            prediction = counts.most_common(1)[0][0]
            return ("leaf", prediction, dict(counts))

        # otherwise build children recursively
        left_tree = self._build_tree(X[best_left_idx], y[best_left_idx], depth + 1)
        right_tree = self._build_tree(X[best_right_idx], y[best_right_idx], depth + 1)

        node = ("node", best_feat, best_thresh, best_is_cat_ordering, left_tree, right_tree)
        return node

    def _predict_one(self, x, node):
        ntype = node[0]
        if ntype == "leaf":
            return node[1]
        # node: ("node", feat, thresh, ordering_or_none, left_tree, right_tree)
        _, feat, thresh, ordering, left_tree, right_tree = node
        val = x[feat]
        if ordering is None:
            # numeric comparison
            if val <= thresh:
                return self._predict_one(x, left_tree)
            else:
                return self._predict_one(x, right_tree)
        else:
            # categorical: map category to its index in ordering if present; unseen categories get nearest high index
            try:
                idx = ordering.index(val)
            except ValueError:
                # unseen category: treat as worst-case — put to the side with higher fraud rate
                # find avg fraud rates in left and right by checking leaf counts (quick heuristic)
                # fallback: assign to right child
                return self._predict_one(x, right_tree)
            if idx <= thresh:
                return self._predict_one(x, left_tree)
            else:
                return self._predict_one(x, right_tree)

    def predict(self, X):
        return np.array([self._predict_one(row, self.tree_) for row in X])

# ---------- Random Forest ----------
class RandomForest:
    def __init__(self, n_trees=10, max_depth=6, min_samples_split=10, max_features=None, random_state=None):
        self.n_trees = n_trees
        self.max_depth = max_depth
        self.min_samples_split = min_samples_split
        self.max_features = max_features
        self.random_state = random_state
        self.trees = []

    def fit(self, X, y, feature_types):
        n_samples = X.shape[0]
        if self.random_state is not None:
            random.seed(self.random_state)
            np.random.seed(self.random_state)
        self.trees = []
        for i in range(self.n_trees):
            # bootstrap sample indexes
            idxs = np.random.choice(np.arange(n_samples, dtype=int), size=n_samples, replace=True)
            X_sample = X[idxs]
            y_sample = y[idxs]
            tree = DecisionTree(
                max_depth=self.max_depth,
                min_samples_split=self.min_samples_split,
                max_features=self.max_features,
                random_state=None
            )
            tree.fit(X_sample, y_sample, feature_types)
            self.trees.append(tree)

    def predict(self, X):
        # collect predictions from each tree
        all_preds = np.vstack([t.predict(X) for t in self.trees])  # shape (n_trees, n_samples)
        # majority vote
        preds = []
        for col in all_preds.T:
            counts = np.bincount(col)
            preds.append(np.argmax(counts))
        return np.array(preds)

if __name__ == "__main__":
    
    true_train_file= "test.csv"
    train_file= "hackathon_train.csv"
    train_data=[]
    train_labels= []
    year= datetime.now().year
    with open(train_file, "r") as fin:
        first= fin.readline().strip().split('|')
        for line in fin:

            line= line.strip().split('|')
            dictionary= {}
            for i, type in enumerate(first):
                dictionary[type]= line[i]

            train_labels.append(int(dictionary["is_fraud"]))
            train_data.append((haversine(float(dictionary["lat"]), float(dictionary["long"]), float(dictionary["merch_lat"]), float(dictionary["merch_long"])), dictionary["gender"], year- int(dictionary["dob"][:4]), int(dictionary["unix_time"])% 8640, dictionary["category"], float(dictionary["amt"])))
    
    df = pd.DataFrame(train_data, columns=["distance", "gender", "age", "time", "category", "amount"])

    # we will keep categorical columns as raw strings and tell tree they are categorical
    feature_cols = ["distance", "gender", "age","time", "category", "amount"]
    feature_types = ["numeric", "categorical", "numeric","numeric", "categorical", "numeric"]
    # Convert DataFrame to numpy array (object dtype for categorical values)
    X = df[feature_cols].values
    y = np.array(train_labels, dtype=int)


    # Train random forest
    rf = RandomForest(n_trees=5, max_depth=4, min_samples_split=1, max_features=3, random_state=42)
    rf.fit(X, y, feature_types)
    data= []
    data_labels= []
    with open(true_train_file, "r") as fin:
        first= fin.readline().strip().split('|')
        for line in fin:

            line= line.strip().split('|')
            dictionary= {}
            for i, type in enumerate(first):
                dictionary[type]= line[i]

            data_labels.append(int(dictionary["is_fraud"]))
            data.append((haversine(float(dictionary["lat"]), float(dictionary["long"]), float(dictionary["merch_lat"]), float(dictionary["merch_long"])), dictionary["gender"], year- int(dictionary["dob"][:4]), int(dictionary["unix_time"])% 8640, dictionary["category"], float(dictionary["amt"])))
    # Predict on training set
    df_new= pd.DataFrame(data, columns=["distance", "gender", "age", "time", "category", "amount"])
    X_new= df_new.values
    preds = rf.predict(X_new)
    print("y_true:", data_labels)
    print("y_pred:", preds)
    acc = (preds== data_labels).mean()
    print("train accuracy:", acc)
    
    