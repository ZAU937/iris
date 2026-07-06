/*Extend the layers from ViewLayer*/

class MaskLayer extends CanvasLayer{
    constructor(port, vm, view){
        super(port, vm, view, "mask");
    }
    render(bbox=null){
        let ctx = this.container.getContext("2d");
        if (bbox === null){
            // No specific coordinates are given, i.e. we redraw the whole mask:
            ctx.clearRect(0, 0, ...vars.image_shape);
            ctx.drawImage(
                vars.hidden_mask,
                vars.mask_area[0], vars.mask_area[1]
            );
        } else {
            ctx.clearRect(
                bbox[0]+vars.mask_area[0],
                bbox[1]+vars.mask_area[1],
                bbox[2], bbox[3]
            );
            ctx.drawImage(
                vars.hidden_mask,
                ...bbox,
                bbox[0]+vars.mask_area[0], bbox[1]+vars.mask_area[1],
                bbox[2], bbox[3]
            );
        }
    }
}

class SuperpixelsLayer extends CanvasLayer{
    // Shows
    //
    //
    //
    constructor(port, vm, view){
        super(port, vm, view, "superpixels");
    }
    render(bbox=null){
        let ctx = this.container.getContext("2d");
        if (bbox === null){
            // No specific coordinates are given, i.e. we redraw the whole mask:
            ctx.clearRect(0, 0, ...vars.image_shape);
            ctx.drawImage(
                vars.hidden_mask,
                vars.mask_area[0], vars.mask_area[1]
            );
        } else {
            ctx.clearRect(
                bbox[0]+vars.mask_area[0],
                bbox[1]+vars.mask_area[1],
                bbox[2], bbox[3]
            );
            ctx.drawImage(
                vars.hidden_mask,
                ...bbox,
                bbox[0]+vars.mask_area[0], bbox[1]+vars.mask_area[1],
                bbox[2], bbox[3]
            );
        }
    }
}

class PreviewLayer extends CanvasLayer{
    constructor(port, vm, view){
        super(port, vm, view, "preview");

        this.container.addEventListener("mousemove", mouse_move, false);
        this.container.addEventListener("mousedown", mouse_down, false);
        this.container.addEventListener("mouseup", mouse_up, false);
        this.container.addEventListener("mouseenter", mouse_enter, false);
        this.container.addEventListener("mousewheel", mouse_wheel, false);
        this.container.addEventListener("DOMMouseScroll", mouse_wheel, false);
    }
    render(){
        let offset = get_tool_offset();

        let ctx = this.container.getContext("2d");
        ctx.clearRect(0, 0, ...vars.image_shape);
        if (vars.tool.type == "bbox") ctx.fillStyle = "rgb(200, 200, 200)";
        else ctx.fillStyle = "rgba(150, 150, 150, 0.5)";
        ctx.fillRect(
            vars.cursor_image[0]+offset.x,
            vars.cursor_image[1]+offset.y,
            vars.tool.size, vars.tool.size
        );

        if (this.view.name != vars.current_view) {
            let image = document.getElementById("cursor");
            let cursor_size = 18 / ctx.getTransform()["a"]
            let cursor_offset = cursor_size / 2
            ctx.drawImage(image, vars.cursor_image[0]-cursor_offset, vars.cursor_image[1]-cursor_offset, cursor_size, cursor_size)
        }

        // Draw the boundaries of the masking area
        ctx.beginPath();
        if (vars.config.views.length < 2){
            ctx.lineWidth = "3";
        } else {
            ctx.lineWidth = "2";
        }

        ctx.strokeStyle = "red";
        ctx.setLineDash([5, 15]);
        ctx.rect(
            vars.mask_area[0], vars.mask_area[1],
            ...vars.mask_shape
        );
        ctx.stroke();

        // Draw preliminary bounding box
        if (vars.box_start != null && vars.box_end != null) {
            ctx.beginPath();
            ctx.lineWidth = "1";
            ctx.strokeStyle = "rgb(180, 180, 180)";
            ctx.setLineDash([5, 5]);
            ctx.rect(
                vars.box_start[0], vars.box_start[1],
                vars.box_end[0] - vars.box_start[0], vars.box_end[1] - vars.box_start[1]
            );
            ctx.stroke();
            ctx.fillStyle = "rgba(180, 180, 180, 0.3)";
            ctx.fillRect(
                vars.box_start[0], vars.box_start[1],
                vars.box_end[0] - vars.box_start[0], vars.box_end[1] - vars.box_start[1]
            );
        }
    }
}

class SelectionLayer extends CanvasLayer {
    constructor(port, vm, view){
        super(port, vm, view, "selected");
    }
    render() {
        let ctx = this.container.getContext("2d");
        ctx.clearRect(0, 0, ...vars.image_shape);
        if (vars.selected_box != null) {
            let box = vars.yolo[vars.selected_box];
            let width = box[3] * vars.image_shape[0];
            let height = box[4] * vars.image_shape[1];
            let x = (box[1] * vars.image_shape[0]) - (width / 2);
            let y = (box[2] * vars.image_shape[1]) - (height / 2);

            let box_scale = 4 / ctx.getTransform()["a"]
            ctx.drawImage(document.getElementById("box_top"), x, y, width, box_scale)
            ctx.drawImage(document.getElementById("box_bottom"), x, y+height-box_scale, width, box_scale)
            ctx.drawImage(document.getElementById("box_left"), x, y, box_scale, height)
            ctx.drawImage(document.getElementById("box_right"), x+width-box_scale, y, box_scale, height)

            let corner_size = 20 / ctx.getTransform()["a"]
            let corner_offset = corner_size / 2
            ctx.drawImage(document.getElementById("box_corner"), x-corner_offset, y-corner_offset, corner_size, corner_size)
            ctx.drawImage(document.getElementById("box_corner"), x-corner_offset, y+height-corner_offset, corner_size, corner_size)
            ctx.drawImage(document.getElementById("box_corner"), x+width-corner_offset, y-corner_offset, corner_size, corner_size)
            ctx.drawImage(document.getElementById("box_corner"), x+width-corner_offset, y+height-corner_offset, corner_size, corner_size)
        }
    }
}
