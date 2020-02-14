import math


def log_spiral_x(a, k, rad):
    return a * math.exp(k*rad) * math.cos(rad)


def log_spiral_y(a, k, rad):
    return a * math.exp(k*rad) * math.sin(rad)


def log_spiral():
    print("generating pattern")


if __name__ == "__main__":
    log_spiral()


# x = a*e^(k*angle)*cos(angle)  y = a*e^(k*angle)*sin(angle) <- log spiral
