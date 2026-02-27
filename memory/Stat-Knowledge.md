# Stat Knowledge Base - Advanced Predictive Modeling for Sports Betting 2026

## Executive Summary
This document contains cutting-edge predictive modeling techniques for sports betting, compiled from academic research, industry best practices, and advanced methodologies. Designed for professional-grade analysis and value betting operations.

---

## 1. ADVANCED AI PREDICTIVE MODELING TECHNIQUES

### 1.1 Deep Learning Architectures

#### Long-Sequence LSTM Modeling (State-of-the-Art 2025)
- **Application**: NBA game outcome prediction with multi-season datasets
- **Key Innovation**: Captures long-term temporal dependencies across seasons
- **Architecture**: Multi-layer LSTM with attention mechanisms
- **Input Features**: 
  - Player performance trajectories
  - Team chemistry metrics
  - Historical matchup data
  - Injury impact vectors
- **Performance**: Outperforms traditional ML by 12-18% in accuracy

#### Graph Attention Networks with Temporal Convolution (GATv2-GCN)
- **Purpose**: Predicting sports performance using player/team relationship graphs
- **Mechanism**: 
  - Nodes: Players/teams
  - Edges: Historical interactions, transfers, matchups
  - Temporal convolution captures form trends
- **Advantage**: Models "who you play affects how you play"
- **Use Cases**: Football lineups, basketball rotations, tennis head-to-heads

#### Transformer-Based Models for Sports
- **Architecture**: Modified BERT/GPT for sports sequences
- **Applications**:
  - Play-by-play outcome prediction
  - Momentum shift detection
  - In-game live betting edges
- **Key Feature**: Self-attention captures complex play interactions

### 1.2 Ensemble Methods

#### Stacked Ensemble Architecture
```
Level 0 (Base Learners):
- XGBoost (structured data)
- LightGBM (speed/efficiency)
- Random Forest (robustness)
- Neural Network (complex patterns)

Level 1 (Meta-Learner):
- Logistic Regression (probability calibration)
- or Ridge Regression (for continuous outcomes)
```

#### Bayesian Model Averaging
- **Purpose**: Weight models by posterior probability
- **Formula**: P(y|D) = Σ P(y|Mk,D) × P(Mk|D)
- **Advantage**: Natural uncertainty quantification
- **Implementation**: Use PyMC or Stan

### 1.3 Probabilistic Forecasting

#### Distribution-Based Soccer Prediction
- **Method**: Predict full score distributions, not just outcomes
- **Techniques**:
  - Poisson regression (goals)
  - Dixon-Coles adjustment (low-scoring games)
  - Bivariate Poisson (correlated team scores)
- **EV Calculation**: Integrate over all possible scores

#### Conformal Prediction
- **Purpose**: Generate prediction intervals with coverage guarantees
- **Sports Application**: "Team A wins with 95% confidence interval [1.8, 2.4] goals"
- **Advantage**: Model-agnostic, finite-sample guarantees

---

## 2. ODDS SCRAPING METHODOLOGIES

### 2.1 Real-Time Data Collection Architecture

#### Distributed Scraping Infrastructure
```
┌─────────────────┐
│   Load Balancer │
└────────┬────────┘
         │
    ┌────┴────┬────────┬────────┐
    │         │        │        │
┌───▼───┐ ┌──▼───┐ ┌──▼───┐ ┌──▼───┐
│Node 1 │ │Node 2│ │Node 3│ │Node N│
│(Proxy)│ │(Proxy)│ │(Proxy)│ │(Proxy)│
└───┬───┘ └──┬───┘ └──┬───┘ └──┬───┘
    │        │        │        │
    └────────┴────────┴────────┘
              │
         ┌────▼────┐
         │ Message │
         │  Queue  │
         └────┬────┘
              │
         ┌────▼────┐
         │  Data   │
         │  Store  │
         └─────────┘
```

#### Scraping Techniques

**1. API-First Approach**
- Pinnacle API (sharp lines)
- Betfair Exchange API
- Sportradar/Stats Perform (official data)
- Odds API aggregators

**2. Web Scraping Stack**
- **Browser**: Playwright/Puppeteer (JavaScript rendering)
- **Rotation**: Residential proxies (Bright Data, Oxylabs)
- **Fingerprint**: Stealth plugins, consistent headers
- **Rate Limiting**: Exponential backoff, jitter

**3. WebSocket Monitoring**
- Real-time odds changes
- Steam detection (sharp money)
- Line movement velocity tracking

### 2.2 Data Normalization

#### Odds Format Conversion
```python
# Decimal to Implied Probability
def decimal_to_prob(decimal_odds):
    return 1 / decimal_odds

# American to Decimal
def american_to_decimal(american):
    if american > 0:
        return (american / 100) + 1
    else:
        return (100 / abs(american)) + 1

# Remove Vig (Juice)
def remove_vig(probs):
    total = sum(probs)
    return [p / total for p in probs]
```

#### Bookmaker Classification
| Tier | Bookmakers | Use Case |
|------|-----------|----------|
| Sharp | Pinnacle, Circa, CRIS | True line estimation |
| Semi-Sharp | Bet365, Unibet, 188Bet | Line validation |
| Recreational | DraftKings, FanDuel | Public sentiment |

### 2.3 Steam Detection

#### Line Movement Analysis
- **Steam Move**: Sudden, synchronized line changes across multiple books
- **Indicators**:
  - >0.5 point move in <5 minutes
  - 3+ books moving simultaneously
  - Sharp book leading, recreational following
- **Action**: Follow the steam (usually indicates sharp money)

---

## 3. EXPECTED VALUE (EV) CALCULATIONS

### 3.1 Fundamental EV Formula

```
EV = (Probability of Win × Potential Profit) - (Probability of Loss × Stake)

Or equivalently:
EV = (True Win% × Decimal Odds) - 1
```

### 3.2 True Probability Estimation

#### Method 1: Power Ratings
```
Team A True Win% = 1 / (1 + 10^((RatingB - RatingA)/400))

Where:
- Rating = Elo, Glicko, or custom power rating
- 400 = scaling factor (can be optimized)
```

#### Method 2: Market Efficiency
```
True Probability = (Sharp Book Implied Prob + Model Prediction) / 2

Weights can be optimized based on:
- Historical accuracy of each source
- Time to event (market becomes more efficient closer to game time)
```

#### Method 3: Kelly Criterion Integration
```
Kelly Fraction = (bp - q) / b

Where:
- b = decimal odds - 1
- p = probability of win
- q = 1 - p

Optimal bet size = Kelly Fraction × Bankroll × Fractional Kelly (0.25-0.5)
```

### 3.3 Advanced EV Adjustments

#### Market Efficiency Curve
```
Efficiency(t) = 1 - e^(-λt)

Where:
- t = hours until event
- λ = sport-specific decay constant

Earlier markets = less efficient = more EV opportunity
```

#### Closing Line Value (CLV)
```
CLV = (Your Odds - Closing Odds) / Closing Odds

Positive CLV → You beat the market
CLV correlation with long-term profit: ~0.7-0.8
```

### 3.4 Multi-Outcome EV

#### Soccer (1X2)
```
EV_Home = (P_Home × Odds_Home) - 1
EV_Draw = (P_Draw × Odds_Draw) - 1  
EV_Away = (P_Away × Odds_Away) - 1

Best bet = max(EV_Home, EV_Draw, EV_Away, 0)
```

#### Asian Handicap
```
EV = Σ [P(Outcome_i) × Payout(Outcome_i)] - 1

Where outcomes include:
- Full win
- Half win
- Push
- Half loss
- Full loss
```

---

## 4. MODEL CALIBRATION & VALIDATION

### 4.1 Calibration Metrics

#### Brier Score
```
BS = (1/N) × Σ (Predicted - Actual)²

Lower = better calibrated
Random guessing = 0.25 for binary outcomes
```

#### Log Loss
```
LL = -(1/N) × Σ [y × log(p) + (1-y) × log(1-p)]

Penalizes confident wrong predictions heavily
```

#### Calibration Curve
- Bin predictions by probability (0-10%, 10-20%, etc.)
- Plot predicted vs. actual win rate
- Perfect calibration = 45-degree line

### 4.2 Cross-Validation for Time Series

#### Walk-Forward Validation
```
Train: [1] → Test: [2]
Train: [1,2] → Test: [3]
Train: [1,2,3] → Test: [4]
...
```

#### Purged K-Fold
- Remove observations within X days of test set
- Prevents data leakage from overlapping form periods

### 4.3 Feature Engineering

#### Momentum Features
```
- EMA_3: Exponential moving average (last 3 games)
- EMA_5: Exponential moving average (last 5 games)
- Form trajectory: Slope of performance over time
- Rest advantage: Days since last game (fatigue)
```

#### Contextual Features
```
- Home/away splits
- Weather conditions (outdoor sports)
- Referee tendencies
- Travel distance (jet lag)
- Rivalry intensity
- Stakes (playoff implications)
```

---

## 5. RISK MANAGEMENT

### 5.1 Bankroll Management

#### Kelly Criterion Variants
| Variant | Formula | Risk Level |
|---------|---------|------------|
| Full Kelly | (bp-q)/b | High variance |
| Half Kelly | 0.5 × Kelly | Balanced |
| Quarter Kelly | 0.25 × Kelly | Conservative |
| Fractional Kelly | f × Kelly | Customizable |

#### Unit Sizing
```
Bet Size (units) = (EV / (Odds - 1)) × Confidence × Kelly Fraction

Where:
- EV = Expected value
- Confidence = Model certainty (0-1)
- Kelly Fraction = Risk tolerance (0.25-1.0)
```

### 5.2 Portfolio Approach

#### Diversification
- Max 5% bankroll on single event
- Max 20% bankroll on single league/day
- Correlation matrix for simultaneous bets

#### Hedge Optimization
```
Minimize: Variance(Portfolio)
Subject to: Expected Return ≥ Target

Use quadratic programming (cvxopt, scipy)
```

---

## 6. ADVANCED TECHNIQUES (2026 Cutting Edge)

### 6.1 Reinforcement Learning for Bet Sizing

#### Deep Q-Networks (DQN)
- **State**: Current bankroll, open positions, recent performance
- **Action**: Bet size (0-5% of bankroll)
- **Reward**: Risk-adjusted return (Sharpe ratio)
- **Advantage**: Learns optimal sizing dynamically

#### Multi-Armed Bandits
- Thompson Sampling for market selection
- Upper Confidence Bound (UCB) for bookmaker choice
- Contextual bandits for situational betting

### 6.2 Natural Language Processing (NLP)

#### Sentiment Analysis
- **Sources**: Twitter, Reddit, news articles
- **Signals**: Injury reports, lineup changes, motivation
- **Model**: FinBERT adapted for sports
- **Edge**: Early detection of impactful news

#### Injury Impact Quantification
```
Impact Score = f(Player_VORP, Replacement_Level, Position_Depth)

Where VORP = Value Over Replacement Player
```

### 6.3 Computer Vision

#### Player Tracking
- **Data**: Second Spectrum, Stats Perform
- **Features**: Speed, distance covered, heat maps
- **Application**: Fatigue prediction, tactical analysis

#### Injury Prediction
- Biomechanical analysis from video
- Movement pattern anomalies
- Return-to-play readiness

### 6.4 Causal Inference

#### Propensity Score Matching
- Compare team performance with/without specific players
- Isolate true impact of injuries/suspensions

#### Difference-in-Differences
- Measure coaching change impact
- Stadium effect estimation

---

## 7. IMPLEMENTATION STACK

### 7.1 Recommended Tech Stack

| Component | Technology |
|-----------|------------|
| Data Collection | Python + Playwright + Redis |
| Feature Store | Feast or Tecton |
| Model Training | PyTorch, XGBoost, LightGBM |
| Experiment Tracking | MLflow or Weights & Biases |
| Model Serving | FastAPI + Docker |
| Database | PostgreSQL + TimescaleDB |
| Monitoring | Grafana + Prometheus |

### 7.2 Data Sources

#### Free Tier
- Football-Data.co.uk (historical odds)
- Understat (xG data)
- FBref (comprehensive stats)
- API-Football (limited free tier)

#### Premium Tier
- Stats Perform ($$$)
- Sportradar ($$$)
- Second Spectrum (NBA tracking)
- Opta ($$$)

---

## 8. KEY METRICS DASHBOARD

### 8.1 Performance Tracking
```
- ROI%: (Profit / Turnover) × 100
- Yield%: (Profit / Total Staked) × 100
- Sharpe Ratio: Return / Volatility
- Max Drawdown: Largest peak-to-trough decline
- CLV: Average closing line value captured
- Win Rate: % of winning bets
- Average Odds: Weighted average odds taken
```

### 8.2 Model Monitoring
```
- Prediction drift (PSI)
- Feature importance stability
- Calibration curve tracking
- Residual analysis
- Market efficiency tracking
```

---

## 9. LEGAL & ETHICAL CONSIDERATIONS

### 9.1 Compliance
- Respect bookmaker Terms of Service
- API rate limits
- Responsible gambling practices
- Jurisdiction regulations

### 9.2 Data Ethics
- No insider information
- Public data only
- Transparent modeling

---

## 10. QUICK REFERENCE FORMULAS

```python
# Implied Probability
implied_prob = 1 / decimal_odds

# True Probability (removing vig)
true_prob = implied_prob / sum(implied_probs)

# EV Calculation
ev = (true_prob * decimal_odds) - 1

# Kelly Criterion
kelly = (decimal_odds * true_prob - 1) / (decimal_odds - 1)

# Expected Growth Rate
eg = true_prob * log(1 + kelly * (decimal_odds - 1)) + (1 - true_prob) * log(1 - kelly)

# ROC-AUC (model discrimination)
from sklearn.metrics import roc_auc_score
auc = roc_auc_score(actual, predicted_probs)
```

---

## References

1. Rios, C. et al. (2025). "Long-Sequence LSTM Modeling for NBA Game Outcome Prediction"
2. Mendes-Neves, T. et al. (2025). "Forecasting Soccer Matches through Distributions"
3. Galekwa, R.M. et al. (2024). "A Systematic Review of Machine Learning in Sports Betting"
4. Walsh, C. & Joshi, A. (2023). "Machine learning for sports betting: should model selection be based on accuracy or calibration?"
5. Luo, R. & Krishnamurthy, V. (2023). "Who You Play Affects How You Play: Graph Attention Networks With Temporal Convolution"
6. Franceschi, L. et al. (2025). "Hyperparameter Optimization in Machine Learning"

---

*Last Updated: 2026-02-27*
*Compiled by: Stat (CAO) - Chief Analyst Agent*
*Classification: Internal Use - Advanced Analytics*
