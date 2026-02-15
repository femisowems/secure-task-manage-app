
import { Controller, Get, Post, Put, Delete, Body, Param, UseGuards, Request } from '@nestjs/common';
import { UserRole } from '@secure-task-manage-app/data/enums';
// import { RolesGuard } from '@secure-task-manage-app/auth/roles.guard';
// import { Roles } from '@secure-task-manage-app/auth/roles.decorator'; // Assuming this exists or we mock its usage
import { TasksService } from './tasks.service';

@Controller('tasks')
// @UseGuards(RolesGuard) 
export class TasksController {
    constructor(private readonly tasksService: TasksService) { }

    @Get()
    // @Roles(UserRole.VIEWER) // Example usage
    async findAll(@Request() req) {
        return this.tasksService.findAll(req.user);
    }

    @Post()
    // @Roles(UserRole.VIEWER) 
    async create(@Request() req, @Body() taskData) {
        return this.tasksService.create(req.user, taskData);
    }

    @Put(':id')
    // @Roles(UserRole.VIEWER) 
    async update(@Request() req, @Param('id') id: string, @Body() taskData) {
        return this.tasksService.update(req.user, id, taskData);
    }

    @Delete(':id')
    // @Roles(UserRole.VIEWER)
    async remove(@Request() req, @Param('id') id: string) {
        return this.tasksService.delete(req.user, id);
    }
}
