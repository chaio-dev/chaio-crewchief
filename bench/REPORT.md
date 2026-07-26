# Hybrid Fleet Benchmark — Results

## angular

| model | pass@1 | pass w/ repair | total wall (s) | total cost | out tokens |
|---|---|---|---|---|---|
| cf-glm-5.2 | 8/8 | 8/8 | 182 | $0.0129 | 1951 |
| cf-gpt-oss-120b | 8/8 | 8/8 | 27 | $0.0046 | 4441 |
| cf-kimi-k2.7-code | 8/8 | 8/8 | 67 | $0.0215 | 4654 |
| cf-qwen2.5-coder-32b | 8/8 | 8/8 | 48 | $0.0036 | 1529 |
| sonnet-5-ref | 8/8 | 8/8 | 23 | $0.0481 | 2275 |

## python

| model | pass@1 | pass w/ repair | total wall (s) | total cost | out tokens |
|---|---|---|---|---|---|
| cf-glm-5.2 | 4/8 | 8/8 | 1159 | $0.0911 | 19244 |
| cf-gpt-oss-120b | 8/8 | 8/8 | 62 | $0.0070 | 8021 |
| cf-kimi-k2.7-code | 8/8 | 8/8 | 430 | $0.0674 | 16319 |
| cf-qwen2.5-coder-32b | 5/8 | 6/8 | 100 | $0.0066 | 3042 |
| sonnet-5-ref | 8/8 | 8/8 | 40 | $0.0785 | 4566 |

## react

| model | pass@1 | pass w/ repair | total wall (s) | total cost | out tokens |
|---|---|---|---|---|---|
| cf-glm-5.2 | 7/8 | 8/8 | 303 | $0.0204 | 3352 |
| cf-gpt-oss-120b | 8/8 | 8/8 | 42 | $0.0061 | 6519 |
| cf-kimi-k2.7-code | 8/8 | 8/8 | 252 | $0.0755 | 18067 |
| cf-qwen2.5-coder-32b | 4/8 | 5/8 | 109 | $0.0090 | 3501 |
| sonnet-5-ref | 8/8 | 8/8 | 31 | $0.0761 | 4231 |

## Overall

| model | pass@1 | pass w/ repair | total wall (s) | total cost | cost per solved |
|---|---|---|---|---|---|
| cf-glm-5.2 | 19/24 (79%) | 24/24 (100%) | 1645 | $0.1245 | $0.00519 |
| cf-gpt-oss-120b | 24/24 (100%) | 24/24 (100%) | 132 | $0.0176 | $0.00073 |
| cf-kimi-k2.7-code | 24/24 (100%) | 24/24 (100%) | 748 | $0.1644 | $0.00685 |
| cf-qwen2.5-coder-32b | 17/24 (71%) | 19/24 (79%) | 257 | $0.0192 | $0.00101 |
| sonnet-5-ref | 24/24 (100%) | 24/24 (100%) | 94 | $0.2027 | $0.00845 |
