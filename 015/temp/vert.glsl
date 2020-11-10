attribute vec3 a_position;

vec3 transView() {
    // 从像素坐标转换到 0.0 到 1.0
    vec3 zeroToOne = a_position / vec3(800, 500, 100);
 
    // 再把 0->1 转换 0->2
    vec3 zeroToTwo = zeroToOne * 2.0;
 
    // 把 0->2 转换到 -1->+1 (裁剪空间)
    vec3 clipSpace = zeroToTwo - 1.0;

    return clipSpace * vec3(1, -1, 1);
}

void main(){
    gl_Position = vec4(transView(), 1);
}